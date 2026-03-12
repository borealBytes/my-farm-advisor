import { Hono } from 'hono';
import type { AppEnv } from '../types';
import { MOLTBOT_PORT } from '../config';
import { findExistingMoltbotProcess, waitForProcess } from '../gateway';

/**
 * Debug routes for inspecting container state
 * Note: These routes should be protected by Cloudflare Access middleware
 * when mounted in the main app
 */
const debug = new Hono<AppEnv>();

// GET /debug/version - Returns version info from inside the container
debug.get('/version', async (c) => {
  const sandbox = c.get('sandbox');
  try {
    // Get OpenClaw version
    const versionProcess = await sandbox.startProcess('openclaw --version');
    await new Promise((resolve) => setTimeout(resolve, 500));
    const versionLogs = await versionProcess.getLogs();
    const moltbotVersion = (versionLogs.stdout || versionLogs.stderr || '').trim();

    // Get node version
    const nodeProcess = await sandbox.startProcess('node --version');
    await new Promise((resolve) => setTimeout(resolve, 500));
    const nodeLogs = await nodeProcess.getLogs();
    const nodeVersion = (nodeLogs.stdout || '').trim();

    return c.json({
      moltbot_version: moltbotVersion,
      node_version: nodeVersion,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ status: 'error', message: `Failed to get version info: ${errorMessage}` }, 500);
  }
});

// GET /debug/processes - List all processes with optional logs
debug.get('/processes', async (c) => {
  const sandbox = c.get('sandbox');
  try {
    const processes = await sandbox.listProcesses();
    const includeLogs = c.req.query('logs') === 'true';

    const processData = await Promise.all(
      processes.map(async (p) => {
        const data: Record<string, unknown> = {
          id: p.id,
          command: p.command,
          status: p.status,
          startTime: p.startTime?.toISOString(),
          endTime: p.endTime?.toISOString(),
          exitCode: p.exitCode,
        };

        if (includeLogs) {
          try {
            const logs = await p.getLogs();
            data.stdout = logs.stdout || '';
            data.stderr = logs.stderr || '';
          } catch {
            data.logs_error = 'Failed to retrieve logs';
          }
        }

        return data;
      }),
    );

    // Sort by status (running first, then starting, completed, failed)
    // Within each status, sort by startTime descending (newest first)
    const statusOrder: Record<string, number> = {
      running: 0,
      starting: 1,
      completed: 2,
      failed: 3,
    };

    processData.sort((a, b) => {
      const statusA = statusOrder[a.status as string] ?? 99;
      const statusB = statusOrder[b.status as string] ?? 99;
      if (statusA !== statusB) {
        return statusA - statusB;
      }
      // Within same status, sort by startTime descending
      const timeA = (a.startTime as string) || '';
      const timeB = (b.startTime as string) || '';
      return timeB.localeCompare(timeA);
    });

    return c.json({ count: processes.length, processes: processData });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: errorMessage }, 500);
  }
});

// GET /debug/gateway-api - Probe the moltbot gateway HTTP API
debug.get('/gateway-api', async (c) => {
  const sandbox = c.get('sandbox');
  const path = c.req.query('path') || '/';
  const MOLTBOT_PORT = 18789;

  try {
    const url = `http://localhost:${MOLTBOT_PORT}${path}`;
    const response = await sandbox.containerFetch(new Request(url), MOLTBOT_PORT);
    const contentType = response.headers.get('content-type') || '';

    let body: string | object;
    if (contentType.includes('application/json')) {
      body = await response.json();
    } else {
      body = await response.text();
    }

    return c.json({
      path,
      status: response.status,
      contentType,
      body,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: errorMessage, path }, 500);
  }
});

// GET /debug/cli - Test OpenClaw CLI commands
debug.get('/cli', async (c) => {
  const sandbox = c.get('sandbox');
  const cmd = c.req.query('cmd') || 'openclaw --help';

  try {
    const proc = await sandbox.startProcess(cmd);
    await waitForProcess(proc, 120000);

    const logs = await proc.getLogs();
    const status = proc.getStatus ? await proc.getStatus() : proc.status;
    return c.json({
      command: cmd,
      status,
      exitCode: proc.exitCode,
      stdout: logs.stdout || '',
      stderr: logs.stderr || '',
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: errorMessage, command: cmd }, 500);
  }
});

// GET /debug/logs - Returns container logs for debugging
debug.get('/logs', async (c) => {
  const sandbox = c.get('sandbox');
  try {
    const processId = c.req.query('id');
    let process = null;

    if (processId) {
      const processes = await sandbox.listProcesses();
      process = processes.find((p) => p.id === processId);
      if (!process) {
        return c.json(
          {
            status: 'not_found',
            message: `Process ${processId} not found`,
            stdout: '',
            stderr: '',
          },
          404,
        );
      }
    } else {
      process = await findExistingMoltbotProcess(sandbox);
      if (!process) {
        return c.json({
          status: 'no_process',
          message: 'No Moltbot process is currently running',
          stdout: '',
          stderr: '',
        });
      }
    }

    const logs = await process.getLogs();
    return c.json({
      status: 'ok',
      process_id: process.id,
      process_status: process.status,
      stdout: logs.stdout || '',
      stderr: logs.stderr || '',
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return c.json(
      {
        status: 'error',
        message: `Failed to get logs: ${errorMessage}`,
        stdout: '',
        stderr: '',
      },
      500,
    );
  }
});

// GET /debug/ws-test - Interactive WebSocket debug page
debug.get('/ws-test', async (c) => {
  const host = c.req.header('host') || 'localhost';
  const protocol = c.req.header('x-forwarded-proto') || 'https';
  const wsProtocol = protocol === 'https' ? 'wss' : 'ws';

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>WebSocket Debug</title>
  <style>
    body { font-family: monospace; padding: 20px; background: #1a1a1a; color: #0f0; }
    #log { white-space: pre-wrap; background: #000; padding: 10px; height: 400px; overflow-y: auto; border: 1px solid #333; }
    button { margin: 5px; padding: 10px; }
    input { padding: 10px; width: 300px; }
    .error { color: #f00; }
    .sent { color: #0ff; }
    .received { color: #0f0; }
    .info { color: #ff0; }
  </style>
</head>
<body>
  <h1>WebSocket Debug Tool</h1>
  <div>
    <button id="connect">Connect</button>
    <button id="disconnect" disabled>Disconnect</button>
    <button id="clear">Clear Log</button>
  </div>
  <div style="margin: 10px 0;">
    <input id="message" placeholder="JSON message to send..." />
    <button id="send" disabled>Send</button>
  </div>
  <div style="margin: 10px 0;">
    <button id="sendConnect" disabled>Send Connect Frame</button>
  </div>
  <div id="log"></div>
  
  <script>
    const wsUrl = '${wsProtocol}://${host}/';
    let ws = null;
    
    const log = (msg, className = '') => {
      const logEl = document.getElementById('log');
      const time = new Date().toISOString().substr(11, 12);
      logEl.innerHTML += '<span class="' + className + '">[' + time + '] ' + msg + '</span>\\n';
      logEl.scrollTop = logEl.scrollHeight;
    };
    
    document.getElementById('connect').onclick = () => {
      log('Connecting to ' + wsUrl + '...', 'info');
      ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        log('Connected!', 'info');
        document.getElementById('connect').disabled = true;
        document.getElementById('disconnect').disabled = false;
        document.getElementById('send').disabled = false;
        document.getElementById('sendConnect').disabled = false;
      };
      
      ws.onmessage = (e) => {
        log('RECV: ' + e.data, 'received');
        try {
          const parsed = JSON.parse(e.data);
          log('  Parsed: ' + JSON.stringify(parsed, null, 2), 'received');
        } catch {}
      };
      
      ws.onerror = (e) => {
        log('ERROR: ' + JSON.stringify(e), 'error');
      };
      
      ws.onclose = (e) => {
        log('Closed: code=' + e.code + ' reason=' + e.reason, 'info');
        document.getElementById('connect').disabled = false;
        document.getElementById('disconnect').disabled = true;
        document.getElementById('send').disabled = true;
        document.getElementById('sendConnect').disabled = true;
        ws = null;
      };
    };
    
    document.getElementById('disconnect').onclick = () => {
      if (ws) ws.close();
    };
    
    document.getElementById('clear').onclick = () => {
      document.getElementById('log').innerHTML = '';
    };
    
    document.getElementById('send').onclick = () => {
      const msg = document.getElementById('message').value;
      if (ws && msg) {
        log('SEND: ' + msg, 'sent');
        ws.send(msg);
      }
    };
    
    document.getElementById('sendConnect').onclick = () => {
      if (!ws) return;
      const connectFrame = {
        type: 'req',
        id: 'debug-' + Date.now(),
        method: 'connect',
        params: {
          minProtocol: 1,
          maxProtocol: 1,
          client: {
            id: 'debug-tool',
            displayName: 'Debug Tool',
            version: '1.0.0',
            mode: 'webchat',
            platform: 'web'
          },
          role: 'operator',
          scopes: []
        }
      };
      const msg = JSON.stringify(connectFrame);
      log('SEND Connect Frame: ' + msg, 'sent');
      ws.send(msg);
    };
    
    document.getElementById('message').onkeypress = (e) => {
      if (e.key === 'Enter') document.getElementById('send').click();
    };
  </script>
</body>
</html>`;

  return c.html(html);
});

debug.get('/provider', async (c) => {
  const preferredProvider = (c.env.PREFERRED_PROVIDER || 'auto').toLowerCase();

  const hasCloudflareGateway = !!(
    c.env.CLOUDFLARE_AI_GATEWAY_API_KEY &&
    c.env.CF_AI_GATEWAY_ACCOUNT_ID &&
    c.env.CF_AI_GATEWAY_GATEWAY_ID
  );
  const hasLegacyGateway = !!(c.env.AI_GATEWAY_API_KEY && c.env.AI_GATEWAY_BASE_URL);
  const hasAnthropic = !!c.env.ANTHROPIC_API_KEY;
  const hasOpenAI = !!c.env.OPENAI_API_KEY;
  const hasNvidia = !!c.env.NVIDIA_API_KEY;
  const hasOpenRouter = !!c.env.OPENROUTER_API_KEY;

  let selectedProvider = 'none';
  let defaultModel: string | null = null;
  let fallbackModels: string[] = [];

  if (hasCloudflareGateway) {
    selectedProvider = 'cloudflare-ai-gateway';
    defaultModel = c.env.CF_AI_GATEWAY_MODEL || 'anthropic/claude-sonnet-4-5';
  } else if (preferredProvider === 'nvidia' && hasNvidia) {
    selectedProvider = 'nvidia';
    defaultModel = c.env.NVIDIA_DEFAULT_MODEL || 'moonshotai/kimi-k2.5';
    fallbackModels = (c.env.NVIDIA_FALLBACK_MODELS || '')
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
  } else if (preferredProvider === 'openrouter' && hasOpenRouter) {
    selectedProvider = 'openrouter';
    defaultModel = c.env.OPENROUTER_DEFAULT_MODEL || 'openrouter/free';
    fallbackModels = (c.env.OPENROUTER_FALLBACK_MODELS || '')
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
  } else if (hasNvidia) {
    selectedProvider = 'nvidia';
    defaultModel = c.env.NVIDIA_DEFAULT_MODEL || 'moonshotai/kimi-k2.5';
    fallbackModels = (c.env.NVIDIA_FALLBACK_MODELS || '')
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
  } else if (hasOpenRouter) {
    selectedProvider = 'openrouter';
    defaultModel = c.env.OPENROUTER_DEFAULT_MODEL || 'openrouter/free';
    fallbackModels = (c.env.OPENROUTER_FALLBACK_MODELS || '')
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
  } else if (hasAnthropic) {
    selectedProvider = 'anthropic';
  } else if (hasOpenAI) {
    selectedProvider = 'openai';
  } else if (hasLegacyGateway) {
    selectedProvider = 'legacy-ai-gateway';
  }

  return c.json({
    preferred_provider: preferredProvider,
    selected_provider: selectedProvider,
    default_model: defaultModel,
    fallback_models: fallbackModels,
    available: {
      cloudflare_ai_gateway: hasCloudflareGateway,
      nvidia: hasNvidia,
      openrouter: hasOpenRouter,
      anthropic: hasAnthropic,
      openai: hasOpenAI,
      legacy_ai_gateway: hasLegacyGateway,
    },
    config: {
      nvidia_base_url: c.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1',
      openrouter_base_url: c.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
    },
  });
});

// GET /debug/env - Show environment configuration (sanitized)
debug.get('/env', async (c) => {
  return c.json({
    has_anthropic_key: !!c.env.ANTHROPIC_API_KEY,
    has_openai_key: !!c.env.OPENAI_API_KEY,
    has_nvidia_key: !!c.env.NVIDIA_API_KEY,
    has_openrouter_key: !!c.env.OPENROUTER_API_KEY,
    preferred_provider: c.env.PREFERRED_PROVIDER || 'auto',
    has_gateway_token: !!(c.env.MOLTBOT_GATEWAY_TOKEN || c.env.OPENCLAW_GATEWAY_TOKEN),
    has_r2_access_key: !!c.env.R2_ACCESS_KEY_ID,
    has_r2_secret_key: !!c.env.R2_SECRET_ACCESS_KEY,
    has_cf_account_id: !!c.env.CF_ACCOUNT_ID,
    dev_mode: c.env.DEV_MODE,
    debug_routes: c.env.DEBUG_ROUTES,
    bind_mode: 'lan',
    cf_access_team_domain: c.env.CF_ACCESS_TEAM_DOMAIN,
    has_cf_access_aud: !!c.env.CF_ACCESS_AUD,
  });
});

// GET /debug/container-config - Read the moltbot config from inside the container
debug.get('/container-config', async (c) => {
  const sandbox = c.get('sandbox');

  try {
    const proc = await sandbox.startProcess('cat /root/.openclaw/openclaw.json');
    await waitForProcess(proc, 5000);

    const logs = await proc.getLogs();
    const stdout = logs.stdout || '';
    const stderr = logs.stderr || '';

    let config = null;
    try {
      config = JSON.parse(stdout);
    } catch {
      // Not valid JSON
    }

    return c.json({
      status: proc.status,
      exitCode: proc.exitCode,
      config,
      raw: config ? undefined : stdout,
      stderr,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: errorMessage }, 500);
  }
});

interface PhaseResult {
  phase: string;
  status: 'pass' | 'fail' | 'skip';
  durationMs: number;
  detail: string;
}

async function timedPhase(
  name: string,
  timeoutMs: number,
  fn: () => Promise<{ status: 'pass' | 'fail'; detail: string }>,
): Promise<PhaseResult> {
  const start = Date.now();
  try {
    const result = await Promise.race([
      fn(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Phase "${name}" timed out after ${timeoutMs}ms`)), timeoutMs),
      ),
    ]);
    return { phase: name, ...result, durationMs: Date.now() - start };
  } catch (err) {
    return {
      phase: name,
      status: 'fail',
      durationMs: Date.now() - start,
      detail: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

// GET /debug/startup-phases - Diagnose startup readiness by distinct phases
// Each phase is independently timed and bounded. The response identifies the
// first failing phase rather than collapsing into a generic "not ready" signal.
debug.get('/startup-phases', async (c) => {
  const sandbox = c.get('sandbox');
  const overallStart = Date.now();
  const phases: PhaseResult[] = [];

  // Phase 1: Sandbox connectivity — can we list processes at all?
  const sandboxPhase = await timedPhase('sandbox_connectivity', 5000, async () => {
    const processes = await sandbox.listProcesses();
    return {
      status: 'pass' as const,
      detail: `Listed ${processes.length} process(es)`,
    };
  });
  phases.push(sandboxPhase);

  if (sandboxPhase.status === 'fail') {
    return c.json({
      overallStatus: 'fail',
      firstFailure: 'sandbox_connectivity',
      overallDurationMs: Date.now() - overallStart,
      phases,
    });
  }

  // Phase 2: Process metadata — can we find a gateway process via metadata?
  let processFound = false;
  let processStatus: string | null = null;
  let processCommand: string | null = null;
  const processPhase = await timedPhase('process_metadata', 5000, async () => {
    const proc = await findExistingMoltbotProcess(sandbox);
    if (proc) {
      processFound = true;
      processStatus = proc.status;
      processCommand = proc.command || null;
      return {
        status: 'pass' as const,
        detail: `Found process id=${proc.id} status=${proc.status} cmd="${(proc.command || '').slice(0, 80)}"`,
      };
    }
    return {
      status: 'fail' as const,
      detail: 'No gateway process found via metadata (findExistingMoltbotProcess returned null)',
    };
  });
  phases.push(processPhase);

  // Phase 3: TCP readiness — is port listening?
  // Run this regardless of process metadata to detect the metadata-vs-port desync
  const tcpPhase = await timedPhase('tcp_readiness', 5000, async () => {
    const response = await Promise.race([
      sandbox.containerFetch(new Request(`http://localhost:${MOLTBOT_PORT}/`), MOLTBOT_PORT),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('TCP probe timeout (3s)')), 3000),
      ),
    ]);
    const bodySnippet = (await response.text()).slice(0, 200);
    const proxyNotListening = bodySnippet.includes('The container is not listening in the TCP address');
    const tcpPass = response.status > 0 && !proxyNotListening;
    return {
      status: tcpPass ? ('pass' as const) : ('fail' as const),
      detail: `Port ${MOLTBOT_PORT} probe status=${response.status} body="${bodySnippet.replace(/"/g, "'")}"`,
    };
  });
  phases.push(tcpPhase);

  // Phase 4: HTTP readiness — does gateway return a meaningful response?
  if (tcpPhase.status === 'pass') {
    const httpPhase = await timedPhase('http_readiness', 5000, async () => {
      const response = await Promise.race([
        sandbox.containerFetch(new Request(`http://localhost:${MOLTBOT_PORT}/`), MOLTBOT_PORT),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('HTTP probe timeout (4s)')), 4000),
        ),
      ]);
      const contentType = response.headers.get('content-type') || '';
      const bodySnippet = (await response.text()).slice(0, 200);
      return {
        status: response.status >= 200 && response.status < 500 ? ('pass' as const) : ('fail' as const),
        detail: `HTTP ${response.status} content-type="${contentType}" body="${bodySnippet.replace(/"/g, "'")}"`,
      };
    });
    phases.push(httpPhase);
  } else {
    phases.push({
      phase: 'http_readiness',
      status: 'skip',
      durationMs: 0,
      detail: 'Skipped: TCP readiness failed',
    });
  }

  // Phase 5: CLI readiness — can we run openclaw --version?
  const cliPhase = await timedPhase('cli_readiness', 8000, async () => {
    const proc = await sandbox.startProcess('openclaw --version');
    const waitResult = await waitForProcess(proc, 6000);
    if (waitResult.timedOut) {
      return { status: 'fail' as const, detail: 'openclaw --version timed out after 6s' };
    }
    const logs = await proc.getLogs();
    const output = (logs.stdout || logs.stderr || '').trim();
    return {
      status: 'pass' as const,
      detail: `CLI responded: "${output.slice(0, 120)}"`,
    };
  });
  phases.push(cliPhase);

  // Determine overall status and first failure
  const firstFailure = phases.find((p) => p.status === 'fail');
  const overallStatus = firstFailure ? 'fail' : 'pass';

  // Flag the critical desync: port listening but no process metadata
  const desyncDetected = tcpPhase.status === 'pass' && processPhase.status === 'fail';

  return c.json({
    overallStatus,
    firstFailure: firstFailure?.phase || null,
    desyncDetected,
    desyncDetail: desyncDetected
      ? 'Port is listening but process metadata is unavailable — this is the known failure mode where ensureMoltbotGateway throws "process metadata is unavailable"'
      : null,
    overallDurationMs: Date.now() - overallStart,
    processFound,
    processStatus,
    processCommand,
    phases,
  });
});

// GET /debug/restart-phases - Diagnose restart and recovery timing
// Triggers a restart then probes each recovery phase with bounded timeouts.
debug.get('/restart-phases', async (c) => {
  const sandbox = c.get('sandbox');
  const overallStart = Date.now();
  const phases: PhaseResult[] = [];

  // Phase 1: Pre-restart state — capture current gateway state
  const preState = await timedPhase('pre_restart_state', 5000, async () => {
    const proc = await findExistingMoltbotProcess(sandbox);
    if (proc) {
      return {
        status: 'pass' as const,
        detail: `Existing process id=${proc.id} status=${proc.status}`,
      };
    }
    return {
      status: 'pass' as const,
      detail: 'No existing gateway process found (clean state)',
    };
  });
  phases.push(preState);

  // Phase 2: Kill existing process
  const killPhase = await timedPhase('kill_existing', 8000, async () => {
    const proc = await findExistingMoltbotProcess(sandbox);
    if (proc) {
      try {
        await proc.kill();
        // Wait briefly for cleanup
        await new Promise((r) => setTimeout(r, 1000));
        return { status: 'pass' as const, detail: `Killed process id=${proc.id}` };
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        // Also try pkill as fallback
        try {
    await sandbox.exec('pkill -f "[o]penclaw gateway|[s]tart-openclaw.sh" || true');
          await new Promise((r) => setTimeout(r, 1000));
        } catch { /* ignore */ }
        return { status: 'pass' as const, detail: `Kill via metadata failed (${msg}), used pkill fallback` };
      }
    }
    return { status: 'pass' as const, detail: 'No process to kill' };
  });
  phases.push(killPhase);

  // Phase 3: Verify process is gone (stale metadata check)
  const staleCheckPhase = await timedPhase('stale_metadata_check', 5000, async () => {
    const proc = await findExistingMoltbotProcess(sandbox);
    if (proc && (proc.status === 'running' || proc.status === 'starting')) {
      return {
        status: 'fail' as const,
        detail: `Stale process still detected: id=${proc.id} status=${proc.status} — metadata did not clear after kill`,
      };
    }
    // Also check TCP
    let portStillOpen = false;
      try {
        const resp = await Promise.race([
          sandbox.containerFetch(new Request(`http://localhost:${MOLTBOT_PORT}/`), MOLTBOT_PORT),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000)),
        ]);
        const bodySnippet = (await resp.text()).slice(0, 200);
        const proxyNotListening = bodySnippet.includes('The container is not listening in the TCP address');
        portStillOpen = resp.status > 0 && !proxyNotListening;
      } catch { /* port closed = good */ }

    return {
      status: 'pass' as const,
      detail: `Process metadata cleared. Port still open: ${portStillOpen}`,
    };
  });
  phases.push(staleCheckPhase);

  // Phase 4: TCP port closed — confirm gateway is actually down
  const portClosedPhase = await timedPhase('port_closed_verification', 5000, async () => {
    // Poll for port closure (max 3s)
    for (let i = 0; i < 6; i++) {
      try {
        await Promise.race([
          sandbox.containerFetch(new Request(`http://localhost:${MOLTBOT_PORT}/`), MOLTBOT_PORT),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 1000)),
        ]);
        // Port still open, wait
        await new Promise((r) => setTimeout(r, 500)); // eslint-disable-line no-await-in-loop
      } catch {
        return { status: 'pass' as const, detail: `Port ${MOLTBOT_PORT} confirmed closed after restart kill` };
      }
    }
    return {
      status: 'fail' as const,
      detail: `Port ${MOLTBOT_PORT} still responding 3s after kill — gateway may not have stopped`,
    };
  });
  phases.push(portClosedPhase);

  // Phase 5: Post-restart process detection — after restart, can we find a new process?
  // We don't actually restart here (that would require ensureMoltbotGateway which couples us).
  // Instead we check the post-kill landscape to understand recovery readiness.
  const recoveryReadyPhase = await timedPhase('recovery_readiness', 3000, async () => {
    const proc = await findExistingMoltbotProcess(sandbox);
    const tcpUp = await (async () => {
      try {
        const resp = await Promise.race([
          sandbox.containerFetch(new Request(`http://localhost:${MOLTBOT_PORT}/`), MOLTBOT_PORT),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000)),
        ]);
        return resp.status > 0;
      } catch {
        return false;
      }
    })();

    if (!proc && !tcpUp) {
      return {
        status: 'pass' as const,
        detail: 'Clean state: no process metadata, no port listener — safe to restart',
      };
    }
    if (proc && tcpUp) {
      return {
        status: 'fail' as const,
        detail: `Unclean state: process id=${proc.id} still present AND port still open`,
      };
    }
    if (!proc && tcpUp) {
      return {
        status: 'fail' as const,
        detail: 'Desync: no process metadata but port still listening — ensureMoltbotGateway would throw "metadata unavailable"',
      };
    }
    return {
      status: 'fail' as const,
      detail: `Anomaly: process metadata present (id=${proc?.id}) but port not listening`,
    };
  });
  phases.push(recoveryReadyPhase);

  const firstFailure = phases.find((p) => p.status === 'fail');
  const overallStatus = firstFailure ? 'fail' : 'pass';

  return c.json({
    overallStatus,
    firstFailure: firstFailure?.phase || null,
    overallDurationMs: Date.now() - overallStart,
    phases,
  });
});

export { debug };
