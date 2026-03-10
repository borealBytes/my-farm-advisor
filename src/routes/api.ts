import { Hono } from 'hono';
import type { AppEnv } from '../types';
import { createAccessMiddleware } from '../auth';
import {
  ensureMoltbotGateway,
  findExistingMoltbotProcess,
  isGatewayHttpReady,
  probeGatewayHealth,
  syncToR2,
  waitForProcess,
} from '../gateway';

// CLI commands can take 10-15 seconds to complete due to WebSocket connection overhead
const CLI_TIMEOUT_MS = 20000;
const ADMIN_ROUTE_TIMEOUT_MS = 30000;

// Fast health probe timeout — probeGatewayHealth() internally runs TCP (~3s) + HTTP (~5s) probes.
// 15s gives ample margin without blocking the admin page for minutes.
const HEALTH_PROBE_TIMEOUT_MS = 15000;

// Capped below STARTUP_TIMEOUT_MS (180s) to keep the admin POST bounded.
const RESTART_TIMEOUT_MS = 90_000;
const RESTART_SETTLE_MS = 2000;
const GATEWAY_PKILL_PATTERN =
  'openclaw gateway|start-openclaw.sh|start-moltbot.sh|clawdbot gateway';

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`${label} timed out after ${timeoutMs}ms`)), timeoutMs);
    }),
  ]);
}

/**
 * API routes
 * - /api/admin/* - Protected admin API routes (Cloudflare Access required)
 *
 * Note: /api/status is now handled by publicRoutes (no auth required)
 */
const api = new Hono<AppEnv>();

/**
 * Admin API routes - all protected by Cloudflare Access
 */
const adminApi = new Hono<AppEnv>();

// Middleware: Verify Cloudflare Access JWT for all admin routes
adminApi.use('*', createAccessMiddleware({ type: 'json' }));

// GET /api/admin/devices - List pending and paired devices
adminApi.get('/devices', async (c) => {
  const sandbox = c.get('sandbox');

  try {
    // Fast health gate — fail immediately if gateway isn't HTTP-ready
    // instead of blocking for up to 180s via ensureMoltbotGateway()
    const health = await withTimeout(
      probeGatewayHealth(sandbox),
      HEALTH_PROBE_TIMEOUT_MS,
      'Gateway health probe',
    );

    if (!health.ready) {
      return c.json(
        {
          error: 'Gateway is not ready for device operations',
          lifecycle: {
            phase: health.phase,
            detail: health.detail,
            probeTimeMs: health.probeTimeMs,
          },
        },
        503,
      );
    }

    const token = c.env.MOLTBOT_GATEWAY_TOKEN;
    const tokenArg = token ? ` --token ${token}` : '';
    const proc = await withTimeout(
      sandbox.startProcess(`openclaw devices list --json${tokenArg}`),
      ADMIN_ROUTE_TIMEOUT_MS,
      'Start devices list command',
    );
    const waitResult = await withTimeout(
      waitForProcess(proc, CLI_TIMEOUT_MS),
      ADMIN_ROUTE_TIMEOUT_MS,
      'Wait for devices list command',
    );
    if (waitResult.timedOut) {
      try {
        await proc.kill();
      } catch {}
      return c.json(
        {
          error: `Device list command timed out after ${CLI_TIMEOUT_MS}ms`,
        },
        504,
      );
    }

    const logs = await withTimeout(proc.getLogs(), ADMIN_ROUTE_TIMEOUT_MS, 'Fetch command logs');
    const stdout = logs.stdout || '';
    const stderr = logs.stderr || '';

    try {
      const jsonMatch = stdout.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        return c.json(data);
      }

      return c.json({
        pending: [],
        paired: [],
        raw: stdout,
        stderr,
      });
    } catch {
      return c.json({
        pending: [],
        paired: [],
        raw: stdout,
        stderr,
        parseError: 'Failed to parse CLI output',
      });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: errorMessage }, 500);
  }
});

// POST /api/admin/devices/:requestId/approve - Approve a pending device
adminApi.post('/devices/:requestId/approve', async (c) => {
  const sandbox = c.get('sandbox');
  const requestId = c.req.param('requestId');

  if (!requestId) {
    return c.json({ error: 'requestId is required' }, 400);
  }

  try {
    const health = await withTimeout(
      probeGatewayHealth(sandbox),
      HEALTH_PROBE_TIMEOUT_MS,
      'Gateway health probe',
    );

    if (!health.ready) {
      return c.json(
        {
          error: 'Gateway is not ready — cannot approve device',
          lifecycle: {
            phase: health.phase,
            detail: health.detail,
            probeTimeMs: health.probeTimeMs,
          },
        },
        503,
      );
    }

    const token = c.env.MOLTBOT_GATEWAY_TOKEN;
    const tokenArg = token ? ` --token ${token}` : '';
    const proc = await withTimeout(
      sandbox.startProcess(`openclaw devices approve ${requestId}${tokenArg}`),
      ADMIN_ROUTE_TIMEOUT_MS,
      'Start device approve command',
    );
    const waitResult = await withTimeout(
      waitForProcess(proc, CLI_TIMEOUT_MS),
      ADMIN_ROUTE_TIMEOUT_MS,
      'Wait for device approve command',
    );
    if (waitResult.timedOut) {
      try {
        await proc.kill();
      } catch {}
      return c.json(
        {
          error: `Device approve command timed out after ${CLI_TIMEOUT_MS}ms`,
        },
        504,
      );
    }

    const logs = await withTimeout(proc.getLogs(), ADMIN_ROUTE_TIMEOUT_MS, 'Fetch command logs');
    const stdout = logs.stdout || '';
    const stderr = logs.stderr || '';

    const success = stdout.toLowerCase().includes('approved') || proc.exitCode === 0;

    return c.json({
      success,
      requestId,
      message: success ? 'Device approved' : 'Approval may have failed',
      stdout,
      stderr,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: errorMessage }, 500);
  }
});

// POST /api/admin/devices/approve-all - Approve all pending devices
adminApi.post('/devices/approve-all', async (c) => {
  const sandbox = c.get('sandbox');

  try {
    const health = await withTimeout(
      probeGatewayHealth(sandbox),
      HEALTH_PROBE_TIMEOUT_MS,
      'Gateway health probe',
    );

    if (!health.ready) {
      return c.json(
        {
          error: 'Gateway is not ready — cannot approve devices',
          lifecycle: {
            phase: health.phase,
            detail: health.detail,
            probeTimeMs: health.probeTimeMs,
          },
        },
        503,
      );
    }

    const token = c.env.MOLTBOT_GATEWAY_TOKEN;
    const tokenArg = token ? ` --token ${token}` : '';
    const listProc = await withTimeout(
      sandbox.startProcess(`openclaw devices list --json${tokenArg}`),
      ADMIN_ROUTE_TIMEOUT_MS,
      'Start devices list command',
    );
    const listWaitResult = await withTimeout(
      waitForProcess(listProc, CLI_TIMEOUT_MS),
      ADMIN_ROUTE_TIMEOUT_MS,
      'Wait for devices list command',
    );
    if (listWaitResult.timedOut) {
      try {
        await listProc.kill();
      } catch {}
      return c.json(
        {
          error: `Device list command timed out after ${CLI_TIMEOUT_MS}ms`,
        },
        504,
      );
    }

    const listLogs = await withTimeout(
      listProc.getLogs(),
      ADMIN_ROUTE_TIMEOUT_MS,
      'Fetch command logs',
    );
    const stdout = listLogs.stdout || '';

    // Parse pending devices
    let pending: Array<{ requestId: string }> = [];
    try {
      const jsonMatch = stdout.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        pending = data.pending || [];
      }
    } catch {
      return c.json({ error: 'Failed to parse device list', raw: stdout }, 500);
    }

    if (pending.length === 0) {
      return c.json({ approved: [], message: 'No pending devices to approve' });
    }

    // Approve each pending device
    const results: Array<{ requestId: string; success: boolean; error?: string }> = [];

    for (const device of pending) {
      try {
        // eslint-disable-next-line no-await-in-loop -- sequential device approval required
        const approveProc = await withTimeout(
          sandbox.startProcess(`openclaw devices approve ${device.requestId}${tokenArg}`),
          ADMIN_ROUTE_TIMEOUT_MS,
          'Start device approve command',
        );
        // eslint-disable-next-line no-await-in-loop
        const approveWaitResult = await withTimeout(
          waitForProcess(approveProc, CLI_TIMEOUT_MS),
          ADMIN_ROUTE_TIMEOUT_MS,
          'Wait for device approve command',
        );
        if (approveWaitResult.timedOut) {
          try {
            await approveProc.kill();
          } catch {}
          results.push({
            requestId: device.requestId,
            success: false,
            error: `Approval timed out after ${CLI_TIMEOUT_MS}ms`,
          });
          continue;
        }

        // eslint-disable-next-line no-await-in-loop
        const approveLogs = await withTimeout(
          approveProc.getLogs(),
          ADMIN_ROUTE_TIMEOUT_MS,
          'Fetch command logs',
        );
        const success =
          approveLogs.stdout?.toLowerCase().includes('approved') || approveProc.exitCode === 0;

        results.push({ requestId: device.requestId, success });
      } catch (err) {
        results.push({
          requestId: device.requestId,
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    }

    const approvedCount = results.filter((r) => r.success).length;
    return c.json({
      approved: results.filter((r) => r.success).map((r) => r.requestId),
      failed: results.filter((r) => !r.success),
      message: `Approved ${approvedCount} of ${pending.length} device(s)`,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: errorMessage }, 500);
  }
});

// GET /api/admin/storage - Get R2 storage status and last sync time
adminApi.get('/storage', async (c) => {
  const sandbox = c.get('sandbox');
  const hasCredentials = !!(
    c.env.R2_ACCESS_KEY_ID &&
    c.env.R2_SECRET_ACCESS_KEY &&
    c.env.CF_ACCOUNT_ID
  );

  const missing: string[] = [];
  if (!c.env.R2_ACCESS_KEY_ID) missing.push('R2_ACCESS_KEY_ID');
  if (!c.env.R2_SECRET_ACCESS_KEY) missing.push('R2_SECRET_ACCESS_KEY');
  if (!c.env.CF_ACCOUNT_ID) missing.push('CF_ACCOUNT_ID');

  let lastSync: string | null = null;

  if (hasCredentials) {
    try {
      const result = await sandbox.exec('cat /tmp/.last-sync 2>/dev/null || echo ""');
      const timestamp = result.stdout?.trim();
      if (timestamp && timestamp !== '') {
        lastSync = timestamp;
      }
    } catch {
      // Ignore errors checking sync status
    }
  }

  return c.json({
    configured: hasCredentials,
    missing: missing.length > 0 ? missing : undefined,
    lastSync,
    devMode: c.env.DEV_MODE === 'true',
    e2eTestMode: c.env.E2E_TEST_MODE === 'true',
    message: hasCredentials
      ? 'R2 storage is configured. Your data will persist across container restarts.'
      : 'R2 storage is not configured. Paired devices and conversations will be lost when the container restarts.',
  });
});

// POST /api/admin/storage/sync - Trigger a manual sync to R2
adminApi.post('/storage/sync', async (c) => {
  const sandbox = c.get('sandbox');

  const result = await syncToR2(sandbox, c.env);

  if (result.success) {
    return c.json({
      success: true,
      message: 'Sync completed successfully',
      lastSync: result.lastSync,
    });
  } else {
    const status = result.error?.includes('not configured') ? 400 : 500;
    return c.json(
      {
        success: false,
        error: result.error,
        details: result.details,
      },
      status,
    );
  }
});

// POST /api/admin/gateway/restart - Deterministic restart with verified recovery
adminApi.post('/gateway/restart', async (c) => {
  const sandbox = c.get('sandbox');

  try {
    // ── Phase 1: Assess pre-restart state ─────────────────────────
    const preHealth = await withTimeout(
      probeGatewayHealth(sandbox),
      HEALTH_PROBE_TIMEOUT_MS,
      'Pre-restart health probe',
    );
    console.log('[Restart] Pre-restart:', preHealth.phase, '-', preHealth.detail);

    // ── Phase 2: Deterministic teardown ───────────────────────────
    const teardownMethod = await teardownGateway(sandbox, preHealth);

    // ── Phase 3: Settle and verify teardown ────────────────────────
    if (teardownMethod !== 'none') {
      await new Promise((r) => setTimeout(r, RESTART_SETTLE_MS));

      const stillAlive = await isGatewayHttpReady(sandbox);
      if (stillAlive) {
        console.warn('[Restart] Gateway survived teardown via', teardownMethod);
        return c.json(
          {
            success: false,
            error:
              'Gateway remained HTTP-responsive after teardown. ' +
              'Container may need recycling.',
            preHealth: { phase: preHealth.phase, detail: preHealth.detail },
            teardownMethod,
          },
          500,
        );
      }
    }

    // ── Phase 4: Start fresh gateway and wait for recovery ────────
    console.log('[Restart] Starting fresh gateway...');
    const recoveryStart = Date.now();

    await withTimeout(
      ensureMoltbotGateway(sandbox, c.env),
      RESTART_TIMEOUT_MS,
      'Gateway recovery after restart',
    );

    // ── Phase 5: Verify recovery health ───────────────────────────
    const postHealth = await withTimeout(
      probeGatewayHealth(sandbox),
      HEALTH_PROBE_TIMEOUT_MS,
      'Post-restart health probe',
    );
    const recoveryMs = Date.now() - recoveryStart;

    if (!postHealth.ready) {
      return c.json(
        {
          success: false,
          error: `Gateway failed to reach healthy state after restart (${recoveryMs}ms)`,
          preHealth: { phase: preHealth.phase, detail: preHealth.detail },
          postHealth: { phase: postHealth.phase, detail: postHealth.detail },
          teardownMethod,
          recoveryMs,
        },
        500,
      );
    }

    return c.json({
      success: true,
      message: 'Gateway restarted and verified healthy',
      preHealth: { phase: preHealth.phase, detail: preHealth.detail },
      postHealth: { phase: postHealth.phase, detail: postHealth.detail },
      teardownMethod,
      recoveryMs,
      processId: postHealth.processId,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Restart] Bounded failure:', errorMessage);
    return c.json(
      {
        success: false,
        error: `Restart failed: ${errorMessage}`,
        bounded: true,
      },
      500,
    );
  }
});

async function teardownGateway(
  sandbox: import('@cloudflare/sandbox').Sandbox,
  health: Awaited<ReturnType<typeof probeGatewayHealth>>,
): Promise<string> {
  if (health.processId) {
    const process = await findExistingMoltbotProcess(sandbox);
    if (process) {
      console.log('[Restart] Killing tracked process:', process.id);
      try {
        await process.kill();
        return 'process_kill';
      } catch (killErr) {
        console.warn('[Restart] Process.kill() failed, falling back to pkill:', killErr);
      }
    }
    return await pkillGateway(sandbox, 'stale_metadata');
  }

  if (health.detail.includes('HTTP-responsive')) {
    console.log('[Restart] Ghost gateway (HTTP alive, no metadata). Force pkill.');
    return await pkillGateway(sandbox, 'ghost');
  }

  console.log('[Restart] No gateway detected. Starting fresh.');
  return 'none';
}

async function pkillGateway(sandbox: import('@cloudflare/sandbox').Sandbox, reason: string): Promise<string> {
  try {
    await sandbox.startProcess(`sh -c "pkill -f '${GATEWAY_PKILL_PATTERN}' || true"`);
    return `pkill_${reason}`;
  } catch {
    return `pkill_${reason}_failed`;
  }
}

// Mount admin API routes under /admin
api.route('/admin', adminApi);

export { api };
