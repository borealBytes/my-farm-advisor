/* @vitest-environment jsdom */

import { render } from "lit";
import { describe, expect, it } from "vitest";
import type { OverviewProps } from "./overview.ts";
import { renderOverview } from "./overview.ts";

function createProps(overrides: Partial<OverviewProps> = {}): OverviewProps {
  return {
    connected: false,
    hello: null,
    bootstrapAuthMode: null,
    settings: {
      gatewayUrl: "wss://farm.example.com",
      token: "",
      sessionKey: "main",
      lastActiveSessionKey: "main",
      theme: "claw",
      themeMode: "system",
      chatFocusMode: false,
      chatShowThinking: true,
      splitRatio: 0.6,
      navCollapsed: false,
      navWidth: 220,
      navGroupsCollapsed: {},
    },
    password: "",
    lastError: null,
    lastErrorCode: null,
    presenceCount: 0,
    sessionsCount: 0,
    cronEnabled: null,
    cronNext: null,
    lastChannelsRefresh: null,
    usageResult: null,
    sessionsResult: null,
    skillsReport: null,
    cronJobs: [],
    cronStatus: null,
    attentionItems: [],
    eventLog: [],
    overviewLogLines: [],
    showGatewayToken: false,
    showGatewayPassword: false,
    onSettingsChange: () => undefined,
    onPasswordChange: () => undefined,
    onSessionKeyChange: () => undefined,
    onToggleGatewayTokenVisibility: () => undefined,
    onToggleGatewayPasswordVisibility: () => undefined,
    onConnect: () => undefined,
    onRefresh: () => undefined,
    onNavigate: () => undefined,
    onRefreshLogs: () => undefined,
    ...overrides,
  };
}

describe("overview view", () => {
  it("shows trusted-proxy public-entry guidance without token bootstrap copy", () => {
    const container = document.createElement("div");
    render(renderOverview(createProps({ bootstrapAuthMode: "trusted-proxy" })), container);

    expect(container.textContent).toContain("Authenticated via trusted proxy.");
    expect(container.textContent).toContain(
      "Open the dashboard root served by your trusted proxy.",
    );
    expect(container.textContent).not.toContain("Get a tokenized dashboard URL:");
    expect(container.textContent).not.toContain("Gateway Token");
    expect(container.textContent).not.toContain("Password (not stored)");
  });

  it("keeps token/password fields for non-trusted-proxy access", () => {
    const container = document.createElement("div");
    render(renderOverview(createProps()), container);

    expect(container.textContent).toContain("Get a tokenized dashboard URL:");
    expect(container.textContent).toContain("Gateway Token");
    expect(container.textContent).toContain("Password (not stored)");
  });
});
