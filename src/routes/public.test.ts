import { describe, it, expect, vi, beforeEach } from 'vitest';
import { publicRoutes } from './public';
import type { MoltbotEnv, AppEnv } from '../types';
import type { Sandbox } from '@cloudflare/sandbox';
import type { Context } from 'hono';

// Mock the gateway module
vi.mock('../gateway', () => ({
  probeGatewayHealth: vi.fn().mockResolvedValue({
    phase: 'unknown',
    ready: false,
    detail: 'mock',
    probeTimeMs: 0,
  }),
}));

// Mock the config module
vi.mock('../config', () => ({
  MOLTBOT_PORT: 18789,
}));

// Mock R2 object type
interface MockR2Object {
  body: ReadableStream;
  httpEtag: string;
  httpMetadata: { contentType: string };
  key: string;
  size: number;
  version: string;
  writeHttpMetadata: (headers: Headers) => void;
}

function createMockR2Object(content: string): MockR2Object {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(content);

  return {
    body: new ReadableStream({
      start(controller) {
        controller.enqueue(bytes);
        controller.close();
      },
    }),
    httpEtag: '"mock-etag"',
    httpMetadata: { contentType: 'text/html; charset=utf-8' },
    key: 'test-key',
    size: bytes.length,
    version: 'mock-version',
    writeHttpMetadata: (headers: Headers) => {
      headers.set('Content-Type', 'text/html; charset=utf-8');
    },
  };
}

function createMockEnv(overrides: Partial<MoltbotEnv> = {}): MoltbotEnv {
  return {
    Sandbox: {} as any,
    ASSETS: {} as any,
    MOLTBOT_BUCKET: {
      get: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      head: vi.fn(),
      list: vi.fn(),
      createMultipartUpload: vi.fn(),
      resumeMultipartUpload: vi.fn(),
    } as unknown as R2Bucket,
    ...overrides,
  };
}

function createMockContext(options: {
  env: MoltbotEnv;
  url: string;
  sandbox?: Sandbox;
}): Context<AppEnv> {
  const url = new URL(options.url);
  const headers = new Headers();

  // Extract path parameters from URL by parsing the route pattern
  // Route: /single-page-html/grower/:growerId/farm/:farmId
  // Use the raw URL string to extract params (before URL normalization)
  // This preserves path traversal attempts like ".." for security testing
  const rawPathMatch = options.url.match(/\/grower\/([^/]+)\/farm\/([^/?#]+)/);

  const params: { growerId?: string; farmId?: string } = {};
  if (rawPathMatch) {
    params.growerId = decodeURIComponent(rawPathMatch[1]);
    params.farmId = decodeURIComponent(rawPathMatch[2]);
  }

  return {
    env: options.env,
    req: {
      url: options.url,
      param: (name?: string) => {
        if (name === undefined) {
          return params;
        }
        return params[name as keyof typeof params];
      },
      header: (name: string) => headers.get(name),
      raw: { headers },
    },
    get: (key: string) => {
      if (key === 'sandbox') return options.sandbox;
      return undefined;
    },
    set: vi.fn(),
    json: vi.fn().mockImplementation((data, status = 200) => {
      return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' },
      });
    }),
    html: vi.fn().mockImplementation((data, status = 200) => {
      return new Response(data, {
        status,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }),
  } as unknown as Context<AppEnv>;
}

describe('publicRoutes', () => {
  describe('GET /single-page-html/grower/:growerId/farm/:farmId', () => {
    let mockEnv: MoltbotEnv;
    let mockBucketGet: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      mockBucketGet = vi.fn();
      mockEnv = createMockEnv({
        MOLTBOT_BUCKET: {
          get: mockBucketGet,
          put: vi.fn(),
          delete: vi.fn(),
          head: vi.fn(),
          list: vi.fn(),
          createMultipartUpload: vi.fn(),
          resumeMultipartUpload: vi.fn(),
        } as unknown as R2Bucket,
      });
    });

    it('returns 200 with HTML content and security headers for valid IDs and existing report', async () => {
      const htmlContent = '<!DOCTYPE html><html><head><title>Test Report</title></head><body>Test</body></html>';
      const mockObject = createMockR2Object(htmlContent);
      mockBucketGet.mockResolvedValue(mockObject);

      const url = 'https://example.com/single-page-html/grower/iowa-demo-grower/farm/iowa-demo-farm';
      const c = createMockContext({ env: mockEnv, url });

      // Find the route handler
      const route = publicRoutes.routes.find(
        (r) => r.method === 'GET' && r.path === '/single-page-html/grower/:growerId/farm/:farmId'
      );
      expect(route).toBeDefined();

      const handler = route!.handler as (c: Context<AppEnv>) => Promise<Response>;
      const response = await handler(c);

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('text/html; charset=utf-8');
      expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
      expect(response.headers.get('Cache-Control')).toBe('public, max-age=300');

      // Verify the R2 key was constructed correctly
      expect(mockBucketGet).toHaveBeenCalledWith(
        'growers/iowa-demo-grower/farms/iowa-demo-farm/derived/reports/report.html'
      );

      // Verify the body contains the HTML
      const body = await response.text();
      expect(body).toBe(htmlContent);
    });

    it('returns 400 for grower ID containing path traversal characters (.)', async () => {
      const url = 'https://example.com/single-page-html/grower/iowa.demo/farm/iowa-demo-farm';
      const c = createMockContext({ env: mockEnv, url });

      const route = publicRoutes.routes.find(
        (r) => r.method === 'GET' && r.path === '/single-page-html/grower/:growerId/farm/:farmId'
      );
      expect(route).toBeDefined();

      const handler = route!.handler as (c: Context<AppEnv>) => Promise<Response>;
      const response = await handler(c);

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({ error: 'Invalid grower or farm ID' });
      expect(mockBucketGet).not.toHaveBeenCalled();
    });

it('returns 400 for grower ID containing path traversal characters (/)', async () => {
    const url = 'https://example.com/single-page-html/grower/iowa%2Fdemo/farm/iowa-demo-farm';
    const c = createMockContext({ env: mockEnv, url });

      const route = publicRoutes.routes.find(
        (r) => r.method === 'GET' && r.path === '/single-page-html/grower/:growerId/farm/:farmId'
      );
      expect(route).toBeDefined();

      const handler = route!.handler as (c: Context<AppEnv>) => Promise<Response>;
      const response = await handler(c);

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({ error: 'Invalid grower or farm ID' });
      expect(mockBucketGet).not.toHaveBeenCalled();
    });

    it('returns 400 for farm ID containing path traversal characters (.)', async () => {
      const url = 'https://example.com/single-page-html/grower/iowa-demo-grower/farm/iowa.demo';
      const c = createMockContext({ env: mockEnv, url });

      const route = publicRoutes.routes.find(
        (r) => r.method === 'GET' && r.path === '/single-page-html/grower/:growerId/farm/:farmId'
      );
      expect(route).toBeDefined();

      const handler = route!.handler as (c: Context<AppEnv>) => Promise<Response>;
      const response = await handler(c);

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({ error: 'Invalid grower or farm ID' });
      expect(mockBucketGet).not.toHaveBeenCalled();
    });

it('returns 400 for farm ID containing path traversal characters (/)', async () => {
    const url = 'https://example.com/single-page-html/grower/iowa-demo-grower/farm/iowa%2Fdemo';
    const c = createMockContext({ env: mockEnv, url });

      const route = publicRoutes.routes.find(
        (r) => r.method === 'GET' && r.path === '/single-page-html/grower/:growerId/farm/:farmId'
      );
      expect(route).toBeDefined();

      const handler = route!.handler as (c: Context<AppEnv>) => Promise<Response>;
      const response = await handler(c);

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({ error: 'Invalid grower or farm ID' });
      expect(mockBucketGet).not.toHaveBeenCalled();
    });

    it('returns 404 when report object does not exist in R2', async () => {
      mockBucketGet.mockResolvedValue(null);

      const url = 'https://example.com/single-page-html/grower/iowa-demo-grower/farm/iowa-demo-farm';
      const c = createMockContext({ env: mockEnv, url });

      const route = publicRoutes.routes.find(
        (r) => r.method === 'GET' && r.path === '/single-page-html/grower/:growerId/farm/:farmId'
      );
      expect(route).toBeDefined();

      const handler = route!.handler as (c: Context<AppEnv>) => Promise<Response>;
      const response = await handler(c);

      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body).toEqual({ error: 'Report not found' });
      expect(mockBucketGet).toHaveBeenCalledWith(
        'growers/iowa-demo-grower/farms/iowa-demo-farm/derived/reports/report.html'
      );
    });

    it('returns 500 when R2 bucket throws an error', async () => {
      mockBucketGet.mockRejectedValue(new Error('R2 connection failed'));

      const url = 'https://example.com/single-page-html/grower/iowa-demo-grower/farm/iowa-demo-farm';
      const c = createMockContext({ env: mockEnv, url });

      const route = publicRoutes.routes.find(
        (r) => r.method === 'GET' && r.path === '/single-page-html/grower/:growerId/farm/:farmId'
      );
      expect(route).toBeDefined();

      const handler = route!.handler as (c: Context<AppEnv>) => Promise<Response>;
      const response = await handler(c);

      expect(response.status).toBe(500);
      const body = await response.json();
      expect(body).toEqual({ error: 'Failed to fetch report' });
      expect(mockBucketGet).toHaveBeenCalledWith(
        'growers/iowa-demo-grower/farms/iowa-demo-farm/derived/reports/report.html'
      );
    });

    it('accepts valid IDs with hyphens and alphanumeric characters', async () => {
      const htmlContent = '<html><body>Valid Report</body></html>';
      const mockObject = createMockR2Object(htmlContent);
      mockBucketGet.mockResolvedValue(mockObject);

      const url = 'https://example.com/single-page-html/grower/grower-123-ABC/farm/farm-456-xyz';
      const c = createMockContext({ env: mockEnv, url });

      const route = publicRoutes.routes.find(
        (r) => r.method === 'GET' && r.path === '/single-page-html/grower/:growerId/farm/:farmId'
      );
      expect(route).toBeDefined();

      const handler = route!.handler as (c: Context<AppEnv>) => Promise<Response>;
      const response = await handler(c);

      expect(response.status).toBe(200);
      expect(mockBucketGet).toHaveBeenCalledWith(
        'growers/grower-123-ABC/farms/farm-456-xyz/derived/reports/report.html'
      );
    });

    it('rejects IDs with double dots (..)', async () => {
      const url = 'https://example.com/single-page-html/grower/../farm/passwd';
      const c = createMockContext({ env: mockEnv, url });

      const route = publicRoutes.routes.find(
        (r) => r.method === 'GET' && r.path === '/single-page-html/grower/:growerId/farm/:farmId'
      );
      expect(route).toBeDefined();

      const handler = route!.handler as (c: Context<AppEnv>) => Promise<Response>;
      const response = await handler(c);

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({ error: 'Invalid grower or farm ID' });
      expect(mockBucketGet).not.toHaveBeenCalled();
    });

    it('rejects IDs with encoded traversal attempts', async () => {
      // Test with URL-encoded dot
      const url = 'https://example.com/single-page-html/grower/grower%2Eid/farm/farm-id';
      const c = createMockContext({ env: mockEnv, url });

      const route = publicRoutes.routes.find(
        (r) => r.method === 'GET' && r.path === '/single-page-html/grower/:growerId/farm/:farmId'
      );
      expect(route).toBeDefined();

      const handler = route!.handler as (c: Context<AppEnv>) => Promise<Response>;
      const response = await handler(c);

      // The encoded dot becomes a literal dot in the param, which should be rejected
      expect(response.status).toBe(400);
      expect(mockBucketGet).not.toHaveBeenCalled();
    });
  });
});
