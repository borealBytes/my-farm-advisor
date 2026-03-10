import type { Sandbox, Process } from '@cloudflare/sandbox';
import type { MoltbotEnv } from '../types';
import { MOLTBOT_PORT, STARTUP_TIMEOUT_MS } from '../config';
import { buildEnvVars } from './env';
import { ensureRcloneConfig } from './r2';

// ---------------------------------------------------------------------------
// Gateway readiness model
//
// Cloudflare Sandbox/Container guidance (gotchas.md) is explicit:
//   - start() returns when the process starts, NOT when ports are ready
//   - TCP port open does NOT mean the HTTP service is ready
//   - Use startAndWaitForPorts()-style semantics before routing traffic
//
// Our phases, in order of increasing confidence:
//   1. PROCESS_FOUND  – gateway process exists in sandbox process list
//   2. TCP_READY      – port 18789 accepts TCP connections (waitForPort)
//   3. HTTP_READY     – HTTP GET to the port returns a valid response
//
// Only HTTP_READY should be treated as "safe to proxy" or "safe for CLI".
// ---------------------------------------------------------------------------

/**
 * Gateway readiness phase — ordered from weakest to strongest signal.
 */
export type GatewayReadinessPhase =
  | 'unknown'
  | 'process_found'
  | 'tcp_ready'
  | 'http_ready';

/**
 * Structured health probe result.
 * Returned by probeGatewayHealth() for callers that need phase detail.
 */
export interface GatewayHealthStatus {
  phase: GatewayReadinessPhase;
  ready: boolean; // true only when phase === 'http_ready'
  processId?: string;
  processStatus?: string;
  detail: string;
  probeTimeMs: number;
}

/** Timeout for the HTTP readiness probe (ms). */
const HTTP_PROBE_TIMEOUT_MS = 5000;
const TEARDOWN_SETTLE_TIMEOUT_MS = 5000;
const TEARDOWN_SETTLE_POLL_MS = 250;

function isManagedGatewayCommand(command: string): boolean {
  const isGatewayProcess =
    command.includes('start-openclaw.sh') ||
    command.includes('/usr/local/bin/start-openclaw.sh') ||
    command.includes('openclaw gateway') ||
    command.includes('start-moltbot.sh') ||
    command.includes('clawdbot gateway');
  const isCliCommand =
    command.includes('openclaw devices') ||
    command.includes('openclaw --version') ||
    command.includes('openclaw onboard') ||
    command.includes('clawdbot devices') ||
    command.includes('clawdbot --version');

  return isGatewayProcess && !isCliCommand;
}

async function forceGatewayTeardown(sandbox: Sandbox, reason: string): Promise<void> {
  console.warn('[Gateway] Forcing deterministic teardown:', reason);

  const teardownCommand =
    "sh -lc \"pkill -f 'openclaw gateway' || true; " +
    "pkill -f 'start-openclaw.sh' || true; " +
    "pkill -f 'clawdbot gateway' || true; " +
    "pkill -f 'start-moltbot.sh' || true\"";

  try {
    await sandbox.startProcess(teardownCommand);
  } catch (error) {
    console.warn('[Gateway] Teardown command failed to start:', error);
  }

  const deadline = Date.now() + TEARDOWN_SETTLE_TIMEOUT_MS;
  while (Date.now() < deadline) {
    // eslint-disable-next-line no-await-in-loop -- intentional polling during teardown
    const httpReady = await isGatewayHttpReady(sandbox);
    if (!httpReady) {
      return;
    }
    // eslint-disable-next-line no-await-in-loop -- intentional polling during teardown
    await new Promise((resolve) => setTimeout(resolve, TEARDOWN_SETTLE_POLL_MS));
  }

  throw new Error(
    `Gateway remained HTTP-responsive after forced teardown (${TEARDOWN_SETTLE_TIMEOUT_MS}ms). ` +
      'Refusing speculative recovery while ownership is unknown.',
  );
}

/**
 * Perform an HTTP probe against the gateway port.
 *
 * This is the **authoritative** readiness signal. TCP-only or metadata-only
 * evidence must NOT be treated as "ready".
 *
 * @returns true if the gateway responds to an HTTP request with status > 0.
 */
export async function isGatewayHttpReady(sandbox: Sandbox): Promise<boolean> {
  try {
    const response = await Promise.race([
      sandbox.containerFetch(
        new Request(`http://localhost:${MOLTBOT_PORT}/`),
        MOLTBOT_PORT,
      ),
      new Promise<never>((_, reject) => {
        setTimeout(
          () => reject(new Error('Gateway HTTP probe timeout')),
          HTTP_PROBE_TIMEOUT_MS,
        );
      }),
    ]);
    return response.status > 0;
  } catch {
    return false;
  }
}

/**
 * Probe the full readiness state of the gateway.
 *
 * Returns the highest phase reached and whether the gateway is truly ready
 * (i.e. HTTP-responsive). Callers should check `result.ready` — never rely
 * solely on `result.phase === 'process_found'` for traffic decisions.
 */
export async function probeGatewayHealth(sandbox: Sandbox): Promise<GatewayHealthStatus> {
  const start = Date.now();

  // Phase 1: Process metadata
  const process = await findExistingMoltbotProcess(sandbox);
  if (!process) {
    const httpReady = await isGatewayHttpReady(sandbox);
    if (httpReady) {
      return {
        phase: 'unknown',
        ready: false,
        detail:
          'Gateway is HTTP-responsive but process metadata is unavailable. Ownership is ambiguous and requires deterministic recreation.',
        probeTimeMs: Date.now() - start,
      };
    }

    return {
      phase: 'unknown',
      ready: false,
      detail: 'No gateway process found in sandbox process list',
      probeTimeMs: Date.now() - start,
    };
  }

  const base: Pick<GatewayHealthStatus, 'processId' | 'processStatus'> = {
    processId: process.id,
    processStatus: process.status,
  };

  // Process exists but not in a viable state
  if (process.status !== 'running' && process.status !== 'starting') {
    return {
      ...base,
      phase: 'process_found',
      ready: false,
      detail: `Gateway process ${process.id} has non-viable status: ${process.status}`,
      probeTimeMs: Date.now() - start,
    };
  }

  // Phase 2: TCP readiness (short probe — just checking if port is bound)
  let tcpReady = false;
  try {
    await process.waitForPort(MOLTBOT_PORT, { mode: 'tcp', timeout: 3000 });
    tcpReady = true;
  } catch {
    // TCP not yet ready — process is still starting
  }

  if (!tcpReady) {
    return {
      ...base,
      phase: 'process_found',
      ready: false,
      detail: `Gateway process ${process.id} is ${process.status} but TCP port ${MOLTBOT_PORT} not yet bound`,
      probeTimeMs: Date.now() - start,
    };
  }

  // Phase 3: HTTP readiness — the only phase that counts as "ready"
  const httpReady = await isGatewayHttpReady(sandbox);
  if (!httpReady) {
    return {
      ...base,
      phase: 'tcp_ready',
      ready: false,
      detail: `Gateway TCP port ${MOLTBOT_PORT} is open but HTTP probe failed — service not ready`,
      probeTimeMs: Date.now() - start,
    };
  }

  return {
    ...base,
    phase: 'http_ready',
    ready: true,
    detail: 'Gateway is HTTP-responsive and ready for traffic',
    probeTimeMs: Date.now() - start,
  };
}

/**
 * Find an existing OpenClaw gateway process
 *
 * @param sandbox - The sandbox instance
 * @returns The process if found and running/starting, null otherwise
 */
export async function findExistingMoltbotProcess(sandbox: Sandbox): Promise<Process | null> {
  try {
    const processes = await sandbox.listProcesses();
    for (const proc of processes) {
      if (isManagedGatewayCommand(proc.command || '')) {
        if (proc.status === 'starting' || proc.status === 'running') {
          return proc;
        }
      }
    }
  } catch (e) {
    console.log('Could not list processes:', e);
  }
  return null;
}

/**
 * Ensure the OpenClaw gateway is running
 *
 * This will:
 * 1. Mount R2 storage if configured
 * 2. Check for an existing gateway process
 * 3. Wait for it to be ready, or start a new one
 *
 * @param sandbox - The sandbox instance
 * @param env - Worker environment bindings
 * @returns The running gateway process
 */
export async function ensureMoltbotGateway(sandbox: Sandbox, env: MoltbotEnv): Promise<Process> {
  // Configure rclone for R2 persistence (non-blocking if not configured).
  // The startup script uses rclone to restore data from R2 on boot.
  await ensureRcloneConfig(sandbox, env);

  const health = await probeGatewayHealth(sandbox);
  console.log('[Gateway] ownership probe:', health.phase, health.detail);

  if (health.phase === 'http_ready' && health.processId) {
    const existingProcess = await findExistingMoltbotProcess(sandbox);
    if (existingProcess) {
      return existingProcess;
    }
  }

  if (health.phase === 'process_found' || health.phase === 'tcp_ready') {
    const existingProcess = await findExistingMoltbotProcess(sandbox);
    if (existingProcess) {
      console.log('[Gateway] Found unhealthy/partial gateway process, recreating:', existingProcess.id);
      try {
        await existingProcess.kill();
      } catch (killError) {
        console.log('Failed to kill process:', killError);
      }
    }
  }

  if (health.phase === 'unknown' && health.detail.includes('process metadata is unavailable')) {
    await forceGatewayTeardown(sandbox, health.detail);
  }

  // Start a new OpenClaw gateway
  console.log('Starting new OpenClaw gateway...');
  const envVars = buildEnvVars(env);
  const command = '/usr/local/bin/start-openclaw.sh';

  console.log('Starting process with command:', command);
  console.log('Environment vars being passed:', Object.keys(envVars));

  let process: Process;
  try {
    process = await sandbox.startProcess(command, {
      env: Object.keys(envVars).length > 0 ? envVars : undefined,
    });
    console.log('Process started with id:', process.id, 'status:', process.status);
  } catch (startErr) {
    console.error('Failed to start process:', startErr);
    throw startErr;
  }

  // Wait for the gateway to be ready
  try {
    console.log('[Gateway] Waiting for OpenClaw gateway to be ready on port', MOLTBOT_PORT);
    await process.waitForPort(MOLTBOT_PORT, { mode: 'tcp', timeout: STARTUP_TIMEOUT_MS });
    const httpReady = await isGatewayHttpReady(sandbox);
    if (!httpReady) {
      throw new Error(
        `Gateway TCP port ${MOLTBOT_PORT} became ready but HTTP probe failed. ` +
        'Refusing to treat TCP-only readiness as healthy.',
      );
    }
    console.log('[Gateway] OpenClaw gateway is ready!');

    const logs = await process.getLogs();
    if (logs.stdout) console.log('[Gateway] stdout:', logs.stdout);
    if (logs.stderr) console.log('[Gateway] stderr:', logs.stderr);
  } catch (e) {
    console.error('[Gateway] waitForPort failed:', e);
    try {
      const logs = await process.getLogs();
      console.error('[Gateway] startup failed. Stderr:', logs.stderr);
      console.error('[Gateway] startup failed. Stdout:', logs.stdout);
      throw new Error(`OpenClaw gateway failed to start. Stderr: ${logs.stderr || '(empty)'}`, {
        cause: e,
      });
    } catch (logErr) {
      console.error('[Gateway] Failed to get logs:', logErr);
      throw e;
    }
  }

  // Verify gateway is actually responding
  console.log('[Gateway] Verifying gateway health...');

  return process;
}
