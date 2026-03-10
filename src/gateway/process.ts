import type { Sandbox, Process } from '@cloudflare/sandbox';
import type { MoltbotEnv } from '../types';
import { MOLTBOT_PORT, STARTUP_TIMEOUT_MS } from '../config';
import { buildEnvVars } from './env';
import { ensureRcloneConfig } from './r2';

async function isGatewayHttpReachable(sandbox: Sandbox): Promise<boolean> {
  try {
    const response = await Promise.race([
      sandbox.containerFetch(new Request(`http://localhost:${MOLTBOT_PORT}/`), MOLTBOT_PORT),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Gateway HTTP probe timeout')), 3000);
      }),
    ]);
    return response.status > 0;
  } catch {
    return false;
  }
}

async function isGatewayPortListening(sandbox: Sandbox): Promise<boolean> {
  try {
    const response = await Promise.race([
      sandbox.containerFetch(new Request(`http://localhost:${MOLTBOT_PORT}/`), MOLTBOT_PORT),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Port probe timeout')), 2000);
      }),
    ]);
    return response.status > 0;
  } catch {
    return false;
  }
}

async function waitForGatewayProcessDetection(sandbox: Sandbox, timeoutMs: number): Promise<Process | null> {
  const intervalMs = 500;
  const maxAttempts = Math.ceil(timeoutMs / intervalMs);

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // eslint-disable-next-line no-await-in-loop -- intentional sequential polling
    const process = await findExistingMoltbotProcess(sandbox);
    if (process) {
      return process;
    }
    // eslint-disable-next-line no-await-in-loop -- intentional sequential polling
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  return null;
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
      // Match gateway process (openclaw gateway or legacy clawdbot gateway)
      // Don't match CLI commands like "openclaw devices list"
      const isGatewayProcess =
        proc.command.includes('start-openclaw.sh') ||
        proc.command.includes('/usr/local/bin/start-openclaw.sh') ||
        proc.command.includes('openclaw gateway') ||
        // Legacy: match old startup script during transition
        proc.command.includes('start-moltbot.sh') ||
        proc.command.includes('clawdbot gateway');
      const isCliCommand =
        proc.command.includes('openclaw devices') ||
        proc.command.includes('openclaw --version') ||
        proc.command.includes('openclaw onboard') ||
        proc.command.includes('clawdbot devices') ||
        proc.command.includes('clawdbot --version');

      if (isGatewayProcess && !isCliCommand) {
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

  // Check if gateway is already running or starting
  const existingProcess = await findExistingMoltbotProcess(sandbox);
  if (existingProcess) {
    console.log(
      'Found existing gateway process:',
      existingProcess.id,
      'status:',
      existingProcess.status,
    );

    // Always use full startup timeout - a process can be "running" but not ready yet
    // (e.g., just started by another concurrent request). Using a shorter timeout
    // causes race conditions where we kill processes that are still initializing.
    try {
      console.log('Waiting for gateway on port', MOLTBOT_PORT, 'timeout:', STARTUP_TIMEOUT_MS);
      await existingProcess.waitForPort(MOLTBOT_PORT, { mode: 'tcp', timeout: STARTUP_TIMEOUT_MS });
      const httpReachable = await isGatewayHttpReachable(sandbox);
      if (!httpReachable) {
        throw new Error('Gateway TCP port opened but HTTP probe failed');
      }
      console.log('Gateway is reachable');
      return existingProcess;
      // eslint-disable-next-line no-unused-vars
    } catch (_e) {
      // Timeout waiting for port - process is likely dead or stuck, kill and restart
      console.log('Existing process not reachable after full timeout, killing and restarting...');
      try {
        await existingProcess.kill();
      } catch (killError) {
        console.log('Failed to kill process:', killError);
      }
    }
  }

  const portListening = await isGatewayPortListening(sandbox);
  if (portListening) {
    const httpReachable = await isGatewayHttpReachable(sandbox);
    if (!httpReachable) {
      throw new Error(
        `Gateway TCP port ${MOLTBOT_PORT} is open but HTTP probe failed. Refusing to continue with unhealthy gateway state.`,
      );
    }
    console.log('Gateway port is already listening; waiting for process detection to avoid double spawn...');
    const detectedProcess = await waitForGatewayProcessDetection(sandbox, 5000);
    if (detectedProcess) {
      return detectedProcess;
    }
    throw new Error(
      `Gateway is already listening on port ${MOLTBOT_PORT} but no matching process was detected. Refusing to start a duplicate process.`,
    );
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
    const httpReachable = await isGatewayHttpReachable(sandbox);
    if (!httpReachable) {
      throw new Error('Gateway HTTP probe failed after TCP port became ready');
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
