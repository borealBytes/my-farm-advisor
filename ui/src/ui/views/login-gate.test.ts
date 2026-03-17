/* @vitest-environment jsdom */

import { render } from "lit";
import { describe, expect, it } from "vitest";
import type { AppViewState } from "../app-view-state.ts";
import { renderLoginGate } from "./login-gate.ts";

function createState(overrides: Partial<AppViewState> = {}): AppViewState {
  return {
    basePath: "",
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
    loginShowGatewayToken: false,
    loginShowGatewayPassword: false,
    lastError: null,
    applySettings: () => undefined,
    connect: () => undefined,
    ...overrides,
  } as unknown as AppViewState;
}

describe("login gate view", () => {
  it("hides token and password inputs for trusted-proxy bootstrap mode", () => {
    const container = document.createElement("div");
    render(renderLoginGate(createState({ bootstrapAuthMode: "trusted-proxy" })), container);

    expect(container.textContent).toContain("Authenticated via trusted proxy.");
    expect(container.textContent).toContain(
      "Open the dashboard root served by your trusted proxy.",
    );
    expect(container.textContent).not.toContain("Get a tokenized dashboard URL:");
    expect(container.textContent).not.toContain("Gateway Token");
    expect(container.textContent).not.toContain("Password (not stored)");
  });

  it("keeps token bootstrap guidance for non-trusted-proxy mode", () => {
    const container = document.createElement("div");
    render(renderLoginGate(createState()), container);

    expect(container.textContent).toContain("Get a tokenized dashboard URL:");
    expect(container.textContent).toContain("Gateway Token");
    expect(container.textContent).toContain("Password (not stored)");
  });
});
