import { describe, expect, it } from "vitest";
import type { OpenClawConfig } from "../config/config.js";
import { ensureTelegramRouteBinding } from "./bootstrap-telegram-bindings.js";

describe("ensureTelegramRouteBinding", () => {
  it("repairs an existing account-wide Telegram binding in place", () => {
    const bindings: NonNullable<OpenClawConfig["bindings"]> = [
      {
        agentId: "wrong-agent",
        match: { channel: "telegram", accountId: "field-operations" },
      },
    ];

    const result = ensureTelegramRouteBinding(bindings, "field-operations", "main");

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      agentId: "main",
      match: { channel: "telegram", accountId: "field-operations" },
    });
  });

  it("does not mutate a scoped Telegram binding that shares the same accountId", () => {
    const scopedBinding: NonNullable<OpenClawConfig["bindings"]>[number] = {
      agentId: "custom-thread-agent",
      match: {
        channel: "telegram",
        accountId: "data-pipeline",
        peer: { kind: "channel", id: "ops-room" },
      },
    };
    const bindings: NonNullable<OpenClawConfig["bindings"]> = [scopedBinding];

    const result = ensureTelegramRouteBinding(bindings, "data-pipeline", "data-pipeline");

    expect(result).toHaveLength(2);
    expect(result[0]).toBe(scopedBinding);
    expect(result[0]).toEqual({
      agentId: "custom-thread-agent",
      match: {
        channel: "telegram",
        accountId: "data-pipeline",
        peer: { kind: "channel", id: "ops-room" },
      },
    });
    expect(result[1]).toEqual({
      agentId: "data-pipeline",
      match: { channel: "telegram", accountId: "data-pipeline" },
    });
  });
});
