import { Hono } from 'hono';
import type { AppEnv } from '../types';
import { MOLTBOT_PORT } from '../config';
import { ensureMoltbotGateway, probeGatewayHealth } from '../gateway';

/**
 * Public routes - NO Cloudflare Access authentication required
 *
 * These routes are mounted BEFORE the auth middleware is applied.
 * Includes: health checks, static assets, and public API endpoints.
 */
const publicRoutes = new Hono<AppEnv>();

// GET /sandbox-health - Health check endpoint
publicRoutes.get('/sandbox-health', (c) => {
  return c.json({
    status: 'ok',
    service: 'moltbot-sandbox',
    gateway_port: MOLTBOT_PORT,
  });
});

// GET /logo.png - Serve logo from ASSETS binding
publicRoutes.get('/logo.png', (c) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

// GET /logo-small.png - Serve small logo from ASSETS binding
publicRoutes.get('/logo-small.png', (c) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

// GET /api/status - Public health check for gateway status (no auth required)
// Uses the multi-phase probe so the loading page and callers get accurate readiness.
publicRoutes.get('/api/status', async (c) => {
  const sandbox = c.get('sandbox');

  try {
    const health = await probeGatewayHealth(sandbox);

    if (health.ready) {
      return c.json({
        ok: true,
        status: 'running',
        phase: health.phase,
        processId: health.processId,
        probeTimeMs: health.probeTimeMs,
      });
    }

    c.executionCtx.waitUntil(
      ensureMoltbotGateway(sandbox, c.env).catch((error: Error) => {
        console.error('[STATUS] Background gateway bootstrap failed:', error);
      }),
    );

    // Map phase to a status the loading page understands
    const statusMap: Record<string, string> = {
      unknown: 'not_running',
      process_found: 'not_responding',
      tcp_ready: 'not_responding',
    };

    return c.json({
      ok: false,
      status: statusMap[health.phase] ?? 'not_responding',
      phase: health.phase,
      detail: health.detail,
      processId: health.processId,
      probeTimeMs: health.probeTimeMs,
    });
  } catch (err) {
    return c.json({
      ok: false,
      status: 'error',
      error: err instanceof Error ? err.message : 'Unknown error',
    });
  }
});

// GET /_admin/assets/* - Admin UI static assets (CSS, JS need to load for login redirect)
// Assets are built to dist/client with base "/_admin/"
publicRoutes.get('/_admin/assets/*', async (c) => {
  const url = new URL(c.req.url);
  // Rewrite /_admin/assets/* to /assets/* for the ASSETS binding
  const assetPath = url.pathname.replace('/_admin/assets/', '/assets/');
  const assetUrl = new URL(assetPath, url.origin);
  return c.env.ASSETS.fetch(new Request(assetUrl.toString(), c.req.raw));
});

// Safe slug pattern: alphanumeric + hyphen only, prevents path traversal
const SAFE_SLUG_PATTERN = /^[a-zA-Z0-9-]+$/;

// GET /single-page-html/grower/:growerId/farm/:farmId - Public farm report
publicRoutes.get('/single-page-html/grower/:growerId/farm/:farmId', async (c) => {
  const { growerId, farmId } = c.req.param();

  if (!SAFE_SLUG_PATTERN.test(growerId) || !SAFE_SLUG_PATTERN.test(farmId)) {
    return c.json({ error: 'Invalid grower or farm ID' }, 400);
  }

  const r2Key = `growers/${growerId}/farms/${farmId}/derived/reports/report.html`;

  try {
    const object = await c.env.MOLTBOT_BUCKET.get(r2Key);

    if (!object) {
      return c.json({ error: 'Report not found' }, 404);
    }

    const headers = new Headers();
    headers.set('Content-Type', 'text/html; charset=utf-8');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('Cache-Control', 'public, max-age=300');

    return new Response(object.body, { headers });
  } catch (err) {
    console.error('[PUBLIC] Error fetching report:', err);
    return c.json({ error: 'Failed to fetch report' }, 500);
  }
});

export { publicRoutes };
