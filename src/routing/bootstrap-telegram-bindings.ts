import type { OpenClawConfig } from "../config/config.js";

type RouteBinding = NonNullable<OpenClawConfig["bindings"]>[number];

function normalizeBindingToken(value: unknown): string {
  if (typeof value === "string") {
    return value.trim().toLowerCase();
  }
  if (typeof value === "number" || typeof value === "bigint") {
    return `${value}`.trim().toLowerCase();
  }
  return "";
}

function asRouteBinding(binding: unknown): RouteBinding | null {
  if (!binding || typeof binding !== "object") {
    return null;
  }
  return binding as RouteBinding;
}

function hasScopedMatchFields(match: Record<string, unknown>): boolean {
  return Boolean(
    match.peer ||
    match.guildId ||
    match.teamId ||
    (Array.isArray(match.roles) && match.roles.length > 0),
  );
}

function isAccountWideTelegramBinding(
  binding: unknown,
  accountId: string,
): binding is RouteBinding {
  const routeBinding = asRouteBinding(binding);
  const match = routeBinding?.match;
  if (!match || typeof match !== "object") {
    return false;
  }
  return (
    normalizeBindingToken(match.channel) === "telegram" &&
    normalizeBindingToken(match.accountId) === normalizeBindingToken(accountId) &&
    !hasScopedMatchFields(match as Record<string, unknown>)
  );
}

function isReusableChannelOnlyTelegramBinding(
  binding: unknown,
  agentId: string,
): binding is RouteBinding {
  const routeBinding = asRouteBinding(binding);
  const match = routeBinding?.match;
  if (!match || typeof match !== "object") {
    return false;
  }
  return (
    normalizeBindingToken(routeBinding.agentId) === normalizeBindingToken(agentId) &&
    normalizeBindingToken(match.channel) === "telegram" &&
    !normalizeBindingToken(match.accountId) &&
    !hasScopedMatchFields(match as Record<string, unknown>)
  );
}

export function ensureTelegramRouteBinding(
  bindings: OpenClawConfig["bindings"],
  accountId: string,
  agentId: string,
): NonNullable<OpenClawConfig["bindings"]> {
  const nextBindings = Array.isArray(bindings) ? bindings : [];

  const existingAccountWideBinding = nextBindings.find((binding) =>
    isAccountWideTelegramBinding(binding, accountId),
  );
  if (existingAccountWideBinding) {
    existingAccountWideBinding.agentId = agentId;
    return nextBindings;
  }

  const reusableBinding = nextBindings.find((binding) =>
    isReusableChannelOnlyTelegramBinding(binding, agentId),
  );
  if (reusableBinding?.match && typeof reusableBinding.match === "object") {
    reusableBinding.match.accountId = accountId;
    reusableBinding.agentId = agentId;
    return nextBindings;
  }

  nextBindings.push({
    agentId,
    match: {
      channel: "telegram",
      accountId,
    },
  });
  return nextBindings;
}
