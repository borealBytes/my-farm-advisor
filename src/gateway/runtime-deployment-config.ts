import type { OpenClawConfig } from "../config/config.js";
import { mergeControlUiAllowedOrigins } from "../config/gateway-control-ui-origins.js";

export const DEFAULT_CLOUDFLARE_TRUSTED_PROXY_USER_HEADER = "cf-access-authenticated-user-email";
export const DEFAULT_CLOUDFLARE_TRUSTED_PROXY_REQUIRED_HEADERS = [
  "cf-access-jwt-assertion",
  "x-forwarded-proto",
] as const;

type DeploymentBootstrapEnv = Partial<
  Pick<
    NodeJS.ProcessEnv,
    | "OPENCLAW_PUBLIC_HOSTNAME"
    | "OPENCLAW_TRUSTED_PROXY_IPS"
    | "OPENCLAW_TRUSTED_PROXY_USER_HEADER"
    | "OPENCLAW_TRUSTED_PROXY_REQUIRED_HEADERS"
    | "OPENCLAW_TRUSTED_PROXY_ALLOW_USERS"
  >
>;

function parseCsvEnv(value: string | undefined): string[] {
  if (!value) {
    return [];
  }
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function normalizePublicControlOrigin(
  publicHostname: string | undefined,
): string | undefined {
  const raw = publicHostname?.trim();
  if (!raw) {
    return undefined;
  }

  const candidate = raw.includes("://") ? raw : `https://${raw}`;
  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    throw new Error(
      `OPENCLAW_PUBLIC_HOSTNAME must be a valid hostname or https URL (got ${JSON.stringify(raw)})`,
    );
  }

  if (parsed.protocol !== "https:") {
    throw new Error(
      `OPENCLAW_PUBLIC_HOSTNAME must resolve to an https origin for trusted-proxy mode (got ${parsed.protocol}//${parsed.host})`,
    );
  }
  if (!parsed.hostname) {
    throw new Error("OPENCLAW_PUBLIC_HOSTNAME must include a hostname for trusted-proxy mode");
  }

  return parsed.origin;
}

export function applyTrustedProxyPublicDeploymentConfig(
  config: OpenClawConfig,
  env: DeploymentBootstrapEnv,
): OpenClawConfig {
  const publicOrigin = normalizePublicControlOrigin(env.OPENCLAW_PUBLIC_HOSTNAME);
  if (!publicOrigin) {
    return config;
  }

  const trustedProxyUserHeader =
    env.OPENCLAW_TRUSTED_PROXY_USER_HEADER?.trim() || DEFAULT_CLOUDFLARE_TRUSTED_PROXY_USER_HEADER;
  const trustedProxyRequiredHeaders = dedupe(
    parseCsvEnv(env.OPENCLAW_TRUSTED_PROXY_REQUIRED_HEADERS).length > 0
      ? parseCsvEnv(env.OPENCLAW_TRUSTED_PROXY_REQUIRED_HEADERS)
      : [...DEFAULT_CLOUDFLARE_TRUSTED_PROXY_REQUIRED_HEADERS],
  );
  const trustedProxyAllowUsers = parseCsvEnv(env.OPENCLAW_TRUSTED_PROXY_ALLOW_USERS);
  const trustedProxies = dedupe(parseCsvEnv(env.OPENCLAW_TRUSTED_PROXY_IPS));

  if (trustedProxies.length === 0) {
    throw new Error(
      "OPENCLAW_PUBLIC_HOSTNAME requires OPENCLAW_TRUSTED_PROXY_IPS so trusted-proxy mode only accepts requests from explicit proxy IPs",
    );
  }

  config.gateway ??= {};
  config.gateway.trustedProxies = trustedProxies;

  const existingAllowedOrigins = Array.isArray(config.gateway.controlUi?.allowedOrigins)
    ? config.gateway.controlUi.allowedOrigins
    : [];

  config.gateway.controlUi = {
    ...config.gateway.controlUi,
    allowedOrigins: mergeControlUiAllowedOrigins(existingAllowedOrigins, [publicOrigin]),
    allowInsecureAuth: false,
    dangerouslyAllowHostHeaderOriginFallback: false,
  };

  const existingAuth = config.gateway.auth ?? {};
  config.gateway.auth = {
    ...(existingAuth.allowTailscale !== undefined
      ? { allowTailscale: existingAuth.allowTailscale }
      : {}),
    ...(existingAuth.rateLimit !== undefined ? { rateLimit: existingAuth.rateLimit } : {}),
    mode: "trusted-proxy",
    trustedProxy: {
      userHeader: trustedProxyUserHeader,
      requiredHeaders: trustedProxyRequiredHeaders,
      ...(trustedProxyAllowUsers.length > 0 ? { allowUsers: trustedProxyAllowUsers } : {}),
    },
  };

  return config;
}

function dedupe(values: Iterable<string>): string[] {
  return Array.from(new Set(values));
}
