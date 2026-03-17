import { describe, expect, it } from "vitest";
import type { OpenClawConfig } from "../config/config.js";
import {
  applyTrustedProxyPublicDeploymentConfig,
  DEFAULT_CLOUDFLARE_TRUSTED_PROXY_REQUIRED_HEADERS,
  DEFAULT_CLOUDFLARE_TRUSTED_PROXY_USER_HEADER,
  normalizePublicControlOrigin,
} from "./runtime-deployment-config.js";

describe("runtime deployment config", () => {
  it("normalizes a bare public hostname to an https origin", () => {
    expect(normalizePublicControlOrigin("my-farm-advisor.superiorbyteworks.com")).toBe(
      "https://my-farm-advisor.superiorbyteworks.com",
    );
  });

  it("rejects non-https public origins", () => {
    expect(() => normalizePublicControlOrigin("http://farm.example.com")).toThrow(
      "must resolve to an https origin",
    );
  });

  it("keeps local bootstrap config unchanged when no public hostname is configured", () => {
    const config: OpenClawConfig = {
      gateway: {
        auth: { mode: "token", token: "local-token" },
        controlUi: {
          allowedOrigins: ["http://127.0.0.1:18789"],
          allowInsecureAuth: true,
        },
      },
    };

    const result = applyTrustedProxyPublicDeploymentConfig(structuredClone(config), {});
    expect(result).toEqual(config);
  });

  it("enables trusted-proxy public deployment defaults for the Cloudflare path", () => {
    const config: OpenClawConfig = {
      gateway: {
        auth: { mode: "token", token: "local-token" },
        controlUi: {
          allowedOrigins: ["http://127.0.0.1:18789"],
          allowInsecureAuth: true,
        },
      },
    };

    const result = applyTrustedProxyPublicDeploymentConfig(structuredClone(config), {
      OPENCLAW_PUBLIC_HOSTNAME: "my-farm-advisor.superiorbyteworks.com",
      OPENCLAW_TRUSTED_PROXY_IPS: "172.30.0.2",
    });

    expect(result.gateway?.trustedProxies).toEqual(["172.30.0.2"]);
    expect(result.gateway?.controlUi).toMatchObject({
      allowInsecureAuth: false,
      dangerouslyAllowHostHeaderOriginFallback: false,
      allowedOrigins: ["http://127.0.0.1:18789", "https://my-farm-advisor.superiorbyteworks.com"],
    });
    expect(result.gateway?.auth).toEqual({
      mode: "trusted-proxy",
      trustedProxy: {
        userHeader: DEFAULT_CLOUDFLARE_TRUSTED_PROXY_USER_HEADER,
        requiredHeaders: [...DEFAULT_CLOUDFLARE_TRUSTED_PROXY_REQUIRED_HEADERS],
      },
    });
  });

  it("preserves both loopback origins when adding the public Cloudflare origin", () => {
    const result = applyTrustedProxyPublicDeploymentConfig(
      {
        gateway: {
          controlUi: {
            allowedOrigins: ["http://localhost:18789", "http://127.0.0.1:18789", "   "],
          },
        },
      },
      {
        OPENCLAW_PUBLIC_HOSTNAME: "farm.example.com",
        OPENCLAW_TRUSTED_PROXY_IPS: "172.30.0.2",
      },
    );

    expect(result.gateway?.controlUi?.allowedOrigins).toEqual([
      "http://localhost:18789",
      "http://127.0.0.1:18789",
      "https://farm.example.com",
    ]);
  });

  it("requires explicit trusted proxy IPs for the public deployment path", () => {
    expect(() =>
      applyTrustedProxyPublicDeploymentConfig(
        {},
        {
          OPENCLAW_PUBLIC_HOSTNAME: "my-farm-advisor.superiorbyteworks.com",
        },
      ),
    ).toThrow("OPENCLAW_PUBLIC_HOSTNAME requires OPENCLAW_TRUSTED_PROXY_IPS");
  });

  it("allows env overrides for Cloudflare trusted-proxy headers and allowlist", () => {
    const result = applyTrustedProxyPublicDeploymentConfig(
      {},
      {
        OPENCLAW_PUBLIC_HOSTNAME: "https://farm.example.com/dashboard?ignored=true",
        OPENCLAW_TRUSTED_PROXY_IPS: "172.30.0.2, 172.30.0.2 ,172.30.0.3",
        OPENCLAW_TRUSTED_PROXY_USER_HEADER: "x-forwarded-user",
        OPENCLAW_TRUSTED_PROXY_REQUIRED_HEADERS: "x-forwarded-proto, cf-access-jwt-assertion",
        OPENCLAW_TRUSTED_PROXY_ALLOW_USERS: "alice@example.com, bob@example.com",
      },
    );

    expect(result.gateway?.trustedProxies).toEqual(["172.30.0.2", "172.30.0.3"]);
    expect(result.gateway?.controlUi?.allowedOrigins).toEqual(["https://farm.example.com"]);
    expect(result.gateway?.auth).toEqual({
      mode: "trusted-proxy",
      trustedProxy: {
        userHeader: "x-forwarded-user",
        requiredHeaders: ["x-forwarded-proto", "cf-access-jwt-assertion"],
        allowUsers: ["alice@example.com", "bob@example.com"],
      },
    });
  });

  it("supports CIDR-based trusted proxy defaults for compose-managed deployments", () => {
    const result = applyTrustedProxyPublicDeploymentConfig(
      {},
      {
        OPENCLAW_PUBLIC_HOSTNAME: "my-farm-advisor.superiorbyteworks.com",
        OPENCLAW_TRUSTED_PROXY_IPS: "10.0.2.3/32,172.30.0.2/32",
      },
    );

    expect(result.gateway?.trustedProxies).toEqual(["10.0.2.3/32", "172.30.0.2/32"]);
    expect(result.gateway?.controlUi?.allowedOrigins).toEqual([
      "https://my-farm-advisor.superiorbyteworks.com",
    ]);
  });
});
