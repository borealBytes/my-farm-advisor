// API client for admin endpoints
// Authentication is handled by Cloudflare Access (JWT in cookies)

const API_BASE = '/api/admin';

export interface PendingDevice {
  requestId: string;
  deviceId: string;
  displayName?: string;
  platform?: string;
  clientId?: string;
  clientMode?: string;
  role?: string;
  roles?: string[];
  scopes?: string[];
  remoteIp?: string;
  ts: number;
}

export interface PairedDevice {
  deviceId: string;
  displayName?: string;
  platform?: string;
  clientId?: string;
  clientMode?: string;
  role?: string;
  roles?: string[];
  scopes?: string[];
  createdAtMs: number;
  approvedAtMs: number;
}

export interface DeviceListResponse {
  pending: PendingDevice[];
  paired: PairedDevice[];
  raw?: string;
  stderr?: string;
  parseError?: string;
  error?: string;
}

export interface ApproveResponse {
  success: boolean;
  requestId: string;
  message?: string;
  stdout?: string;
  stderr?: string;
  error?: string;
}

export interface ApproveAllResponse {
  approved: string[];
  failed: Array<{ requestId: string; success: boolean; error?: string }>;
  message?: string;
  error?: string;
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

async function apiRequest<T>(path: string, options: globalThis.RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);
  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      credentials: 'include',
      signal: options.signal || controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    } as globalThis.RequestInit);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out after 30 seconds');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  if (response.status === 401) {
    throw new AuthError('Unauthorized - please log in via Cloudflare Access');
  }

  const contentType = response.headers.get('content-type') || '';
  const rawBody = await response.text();

  if (!contentType.includes('application/json')) {
    if (rawBody.includes('cloudflareaccess.com') || rawBody.includes('CF_Authorization')) {
      throw new AuthError('Cloudflare Access session required. Please log in again.');
    }
    throw new Error(`Unexpected API response format (${contentType || 'unknown content-type'})`);
  }

  let data: (T & { error?: string }) | null = null;
  try {
    data = JSON.parse(rawBody) as T & { error?: string };
  } catch {
    throw new Error('Invalid JSON response from server');
  }

  if (!response.ok) {
    throw new Error(data.error || `API error: ${response.status}`);
  }

  return data;
}

export async function listDevices(): Promise<DeviceListResponse> {
  return apiRequest<DeviceListResponse>('/devices');
}

export async function approveDevice(requestId: string): Promise<ApproveResponse> {
  return apiRequest<ApproveResponse>(`/devices/${requestId}/approve`, {
    method: 'POST',
  });
}

export async function approveAllDevices(): Promise<ApproveAllResponse> {
  return apiRequest<ApproveAllResponse>('/devices/approve-all', {
    method: 'POST',
  });
}

export interface RestartGatewayResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export async function restartGateway(): Promise<RestartGatewayResponse> {
  return apiRequest<RestartGatewayResponse>('/gateway/restart', {
    method: 'POST',
  });
}

export interface StorageStatusResponse {
  configured: boolean;
  missing?: string[];
  lastSync: string | null;
  devMode?: boolean;
  e2eTestMode?: boolean;
  message: string;
}

export async function getStorageStatus(): Promise<StorageStatusResponse> {
  return apiRequest<StorageStatusResponse>('/storage');
}

export interface SyncResponse {
  success: boolean;
  message?: string;
  lastSync?: string;
  error?: string;
  details?: string;
}

export async function triggerSync(): Promise<SyncResponse> {
  return apiRequest<SyncResponse>('/storage/sync', {
    method: 'POST',
  });
}
