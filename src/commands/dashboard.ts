import { readConfigFileSnapshot, resolveGatewayPort } from "../config/config.js";
import type { OpenClawConfig } from "../config/types.js";
import { normalizeControlUiBasePath } from "../gateway/control-ui-shared.js";
import { readGatewayTokenEnv } from "../gateway/credentials.js";
import { resolveConfiguredSecretInputWithFallback } from "../gateway/resolve-configured-secret-input-string.js";
import { copyToClipboard } from "../infra/clipboard.js";
import type { RuntimeEnv } from "../runtime.js";
import { defaultRuntime } from "../runtime.js";
import {
  detectBrowserOpenSupport,
  formatControlUiSshHint,
  openUrl,
  resolveControlUiLinks,
} from "./onboard-helpers.js";

type DashboardOptions = {
  noOpen?: boolean;
};

function isLoopbackDashboardHost(hostname: string): boolean {
  const normalized = hostname.trim().toLowerCase();
  return normalized === "localhost" || normalized === "127.0.0.1" || normalized === "::1";
}

function rankTrustedProxyOrigin(value: string): number {
  try {
    const url = new URL(value);
    const isLoopback = isLoopbackDashboardHost(url.hostname);
    if (url.protocol === "https:" && !isLoopback) {
      return 3;
    }
    if (!isLoopback && (url.protocol === "https:" || url.protocol === "http:")) {
      return 2;
    }
    if (url.protocol === "https:" || url.protocol === "http:") {
      return 1;
    }
  } catch {}
  return 0;
}

function resolveTrustedProxyDashboardUrl(cfg: OpenClawConfig, fallbackUrl: string): string {
  if (cfg.gateway?.auth?.mode !== "trusted-proxy") {
    return fallbackUrl;
  }
  const publicOrigin = [...(cfg.gateway?.controlUi?.allowedOrigins ?? [])]
    .map((value) => value.trim())
    .toSorted((left, right) => rankTrustedProxyOrigin(right) - rankTrustedProxyOrigin(left))
    .find((value) => rankTrustedProxyOrigin(value) > 0);
  if (!publicOrigin) {
    return fallbackUrl;
  }

  const basePath = normalizeControlUiBasePath(cfg.gateway?.controlUi?.basePath);
  try {
    const url = new URL(publicOrigin);
    url.pathname = basePath ? `${basePath}/` : "/";
    url.search = "";
    url.hash = "";
    return url.toString();
  } catch {
    return fallbackUrl;
  }
}

async function resolveDashboardToken(
  cfg: OpenClawConfig,
  env: NodeJS.ProcessEnv = process.env,
): Promise<{
  token?: string;
  source?: "config" | "env" | "secretRef";
  unresolvedRefReason?: string;
  tokenSecretRefConfigured: boolean;
}> {
  const resolved = await resolveConfiguredSecretInputWithFallback({
    config: cfg,
    env,
    value: cfg.gateway?.auth?.token,
    path: "gateway.auth.token",
    readFallback: () => readGatewayTokenEnv(env),
  });
  return {
    token: resolved.value,
    source:
      resolved.source === "config"
        ? "config"
        : resolved.source === "secretRef"
          ? "secretRef"
          : resolved.source === "fallback"
            ? "env"
            : undefined,
    unresolvedRefReason: resolved.unresolvedRefReason,
    tokenSecretRefConfigured: resolved.secretRefConfigured,
  };
}

export async function dashboardCommand(
  runtime: RuntimeEnv = defaultRuntime,
  options: DashboardOptions = {},
) {
  const snapshot = await readConfigFileSnapshot();
  const cfg = snapshot.valid ? snapshot.config : {};
  const port = resolveGatewayPort(cfg);
  const bind = cfg.gateway?.bind ?? "loopback";
  const basePath = cfg.gateway?.controlUi?.basePath;
  const customBindHost = cfg.gateway?.customBindHost;
  const isTrustedProxy = cfg.gateway?.auth?.mode === "trusted-proxy";
  const resolvedToken = await resolveDashboardToken(cfg, process.env);
  const token = resolvedToken.token ?? "";

  // LAN URLs fail secure-context checks in browsers.
  // Coerce only lan->loopback and preserve other bind modes.
  const links = resolveControlUiLinks({
    port,
    bind: bind === "lan" ? "loopback" : bind,
    customBindHost,
    basePath,
  });
  // Avoid embedding externally managed SecretRef tokens in terminal/clipboard/browser args.
  const includeTokenInUrl =
    !isTrustedProxy && token.length > 0 && !resolvedToken.tokenSecretRefConfigured;
  // Prefer URL fragment to avoid leaking auth tokens via query params.
  const localDashboardUrl = includeTokenInUrl
    ? `${links.httpUrl}#token=${encodeURIComponent(token)}`
    : links.httpUrl;
  const dashboardUrl = resolveTrustedProxyDashboardUrl(cfg, localDashboardUrl);

  runtime.log(`Dashboard URL: ${dashboardUrl}`);
  if (isTrustedProxy) {
    runtime.log(
      "Trusted-proxy mode: use the dashboard root above as the supported public admin entry.",
    );
  } else if (resolvedToken.tokenSecretRefConfigured && token) {
    runtime.log(
      "Token auto-auth is disabled for SecretRef-managed gateway.auth.token; use your external token source if prompted.",
    );
  }
  if (!isTrustedProxy && resolvedToken.unresolvedRefReason) {
    runtime.log(`Token auto-auth unavailable: ${resolvedToken.unresolvedRefReason}`);
    runtime.log(
      "Set OPENCLAW_GATEWAY_TOKEN in this shell or resolve your secret provider, then rerun `openclaw dashboard`.",
    );
  }

  const copied = await copyToClipboard(dashboardUrl).catch(() => false);
  runtime.log(copied ? "Copied to clipboard." : "Copy to clipboard unavailable.");

  let opened = false;
  let hint: string | undefined;
  if (!options.noOpen) {
    const browserSupport = await detectBrowserOpenSupport();
    if (browserSupport.ok) {
      opened = await openUrl(dashboardUrl);
    }
    if (!opened) {
      hint = isTrustedProxy
        ? "Open the dashboard root above in your browser; trusted proxy auth handles sign-in."
        : formatControlUiSshHint({
            port,
            basePath,
            token: includeTokenInUrl ? token || undefined : undefined,
          });
    }
  } else {
    hint = isTrustedProxy
      ? "Browser launch disabled (--no-open). Use the dashboard root above; trusted proxy auth handles sign-in."
      : "Browser launch disabled (--no-open). Use the URL above.";
  }

  if (opened) {
    runtime.log("Opened in your browser. Keep that tab to control OpenClaw.");
  } else if (hint) {
    runtime.log(hint);
  }
}
