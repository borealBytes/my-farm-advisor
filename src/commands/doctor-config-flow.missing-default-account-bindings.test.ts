import { describe, expect, it } from "vitest";
import type { OpenClawConfig } from "../config/config.js";
import { collectMissingDefaultAccountBindingWarnings } from "./doctor-config-flow.js";

describe("collectMissingDefaultAccountBindingWarnings", () => {
  it("warns when named accounts exist without default and no valid binding exists", () => {
    const cfg: OpenClawConfig = {
      channels: {
        telegram: {
          accounts: {
            alerts: { botToken: "a" },
            work: { botToken: "w" },
          },
        },
      },
      bindings: [{ agentId: "ops", match: { channel: "telegram" } }],
    };

    const warnings = collectMissingDefaultAccountBindingWarnings(cfg);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain("channels.telegram");
    expect(warnings[0]).toContain("alerts, work");
  });

  it("does not warn when an explicit account binding exists", () => {
    const cfg: OpenClawConfig = {
      channels: {
        telegram: {
          accounts: {
            alerts: { botToken: "a" },
          },
        },
      },
      bindings: [{ agentId: "ops", match: { channel: "telegram", accountId: "alerts" } }],
    };

    expect(collectMissingDefaultAccountBindingWarnings(cfg)).toEqual([]);
  });

  it("warns when bindings cover only a subset of configured accounts", () => {
    const cfg: OpenClawConfig = {
      channels: {
        telegram: {
          accounts: {
            alerts: { botToken: "a" },
            work: { botToken: "w" },
          },
        },
      },
      bindings: [{ agentId: "ops", match: { channel: "telegram", accountId: "alerts" } }],
    };

    const warnings = collectMissingDefaultAccountBindingWarnings(cfg);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain("subset");
    expect(warnings[0]).toContain("Uncovered accounts: work");
  });

  it("warns when the farm Telegram accounts leave Data Pipeline without an explicit binding", () => {
    const cfg: OpenClawConfig = {
      channels: {
        telegram: {
          defaultAccount: "field-operations",
          accounts: {
            "field-operations": { botToken: "field-operations-token" },
            "data-pipeline": { botToken: "data-pipeline-token" },
          },
        },
      },
      bindings: [
        {
          agentId: "field-operations",
          match: { channel: "telegram", accountId: "field-operations" },
        },
      ],
    };

    const warnings = collectMissingDefaultAccountBindingWarnings(cfg);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain("subset");
    expect(warnings[0]).toContain("Uncovered accounts: data-pipeline");
  });

  it("warns when only the root dashboard agent has a channel-only Telegram binding", () => {
    const cfg: OpenClawConfig = {
      channels: {
        telegram: {
          defaultAccount: "field-operations",
          accounts: {
            "field-operations": { botToken: "field-operations-token" },
            "data-pipeline": { botToken: "data-pipeline-token" },
          },
        },
      },
      bindings: [{ agentId: "main", match: { channel: "telegram" } }],
    };

    const warnings = collectMissingDefaultAccountBindingWarnings(cfg);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain("no valid account-scoped binding exists");
    expect(warnings[0]).toContain("data-pipeline, field-operations");
    expect(warnings[0]).toContain("Channel-only bindings (no accountId) match only default");
  });

  it("warns when field operations is explicit but Data Pipeline still relies on channel-only Telegram coverage", () => {
    const cfg: OpenClawConfig = {
      channels: {
        telegram: {
          defaultAccount: "field-operations",
          accounts: {
            "field-operations": { botToken: "field-operations-token" },
            "data-pipeline": { botToken: "data-pipeline-token" },
          },
        },
      },
      bindings: [
        { agentId: "main", match: { channel: "telegram" } },
        {
          agentId: "main",
          match: { channel: "telegram", accountId: "field-operations" },
        },
      ],
    };

    const warnings = collectMissingDefaultAccountBindingWarnings(cfg);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain("subset");
    expect(warnings[0]).toContain("Uncovered accounts: data-pipeline");
  });

  it("does not warn when wildcard account binding exists", () => {
    const cfg: OpenClawConfig = {
      channels: {
        telegram: {
          accounts: {
            alerts: { botToken: "a" },
          },
        },
      },
      bindings: [{ agentId: "ops", match: { channel: "telegram", accountId: "*" } }],
    };

    expect(collectMissingDefaultAccountBindingWarnings(cfg)).toEqual([]);
  });

  it("does not warn when default account is present", () => {
    const cfg: OpenClawConfig = {
      channels: {
        telegram: {
          accounts: {
            default: { botToken: "d" },
            alerts: { botToken: "a" },
          },
        },
      },
      bindings: [{ agentId: "ops", match: { channel: "telegram" } }],
    };

    expect(collectMissingDefaultAccountBindingWarnings(cfg)).toEqual([]);
  });
});
