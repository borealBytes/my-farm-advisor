import { spawnSync, type SpawnSyncReturns } from "node:child_process";
import { randomUUID } from "node:crypto";
import { chmod, copyFile, mkdir, mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const repoRoot = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");

type DockerSetupSandbox = {
  rootDir: string;
  scriptPath: string;
  logPath: string;
  binDir: string;
};

type LiveComposeSandbox = {
  rootDir: string;
  dataDir: string;
  projectName: string;
  bridgePort: number;
  browserControlPort: number;
  gatewayToken: string;
};

const pluginResolutionSubpaths = [
  "openclaw/plugin-sdk/core",
  "openclaw/plugin-sdk/device-pair",
  "openclaw/plugin-sdk/memory-core",
] as const;

const pluginResolutionRegressionSpecifier = "openclaw/plugin-sdk/core";

const knownPluginFailurePatterns = [
  /\[plugins\].*failed to load plugin:/i,
  /\[plugins\].*failed during register/i,
  /\[plugins\].*missing register\/activate export/i,
  /\[plugins\].*invalid config:/i,
  /ERR_MODULE_NOT_FOUND/i,
  /Cannot find module ["']openclaw\/plugin-sdk\/(core|device-pair|memory-core)["']/i,
  /Cannot find package ["']openclaw\/plugin-sdk\/(core|device-pair|memory-core)["']/i,
];

const pluginResolutionScript = [
  `import { createRequire } from 'node:module';`,
  `const require = createRequire(import.meta.url);`,
  ...pluginResolutionSubpaths.map(
    (specifier) =>
      `console.log(${JSON.stringify(`require.resolve('${specifier}') => `)} + require.resolve(${JSON.stringify(specifier)}));`,
  ),
].join(" ");

const liveComposeSmokeEnabled = isTruthyEnvValue(process.env.OPENCLAW_DOCKER_COMPOSE_SMOKE);

type SmokeCommandResult = SpawnSyncReturns<string>;

function extractMarkdownBashBlock(markdown: string, requiredLines: string[]): string[] {
  const blocks = Array.from(markdown.matchAll(/```bash\n([\s\S]*?)```/g), (match) =>
    match[1]
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith("#")),
  );
  const matchingBlock = blocks.find((lines) => requiredLines.every((line) => lines.includes(line)));
  expect(matchingBlock, `expected bash block containing ${requiredLines.join(", ")}`).toBeDefined();
  return matchingBlock ?? [];
}

function extractStubbedCommandSequence(log: string): string[] {
  return log
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => line.replace(/^(build|compose)\s+/, ""));
}

function expectOrderedSubsequence(actualLines: string[], expectedLines: string[], context: string) {
  let nextIndex = 0;
  for (const expectedLine of expectedLines) {
    const foundIndex = actualLines.findIndex(
      (line, index) => index >= nextIndex && line.includes(expectedLine),
    );
    expect(foundIndex, `${context} should contain ${expectedLine} in order`).toBeGreaterThanOrEqual(
      0,
    );
    nextIndex = foundIndex + 1;
  }
}

function assertNoKnownPluginFailures(output: string, context: string) {
  for (const pattern of knownPluginFailurePatterns) {
    expect(output, `${context} should not match ${pattern}`).not.toMatch(pattern);
  }
}

type CoolifyTunnelContract = {
  gatewayPublishedPorts: string[];
  browserControlPublishedPorts: string[];
  tunnelOriginTarget?: string;
};

function deriveExpectedCoolifyTunnelContract(env: {
  CLOUDFLARE_TUNNEL_TOKEN?: string;
  OPENCLAW_PUBLIC_HOSTNAME?: string;
}): CoolifyTunnelContract {
  const hasTunnelToken = Boolean(env.CLOUDFLARE_TUNNEL_TOKEN?.trim());

  return {
    gatewayPublishedPorts: ["127.0.0.1:18789:18789"],
    browserControlPublishedPorts: [],
    tunnelOriginTarget: hasTunnelToken ? "openclaw-gateway:18789" : undefined,
  };
}

function runComposeCommand(
  sandbox: DockerSetupSandbox,
  args: string[],
  overrides: Record<string, string | undefined> = {},
): SmokeCommandResult {
  return spawnSync("docker", ["compose", ...args], {
    cwd: sandbox.rootDir,
    env: createEnv(sandbox, overrides),
    encoding: "utf8",
  });
}

function isTruthyEnvValue(raw: string | undefined): boolean {
  if (!raw) {
    return false;
  }

  switch (raw.trim().toLowerCase()) {
    case "1":
    case "true":
    case "yes":
    case "on":
      return true;
    default:
      return false;
  }
}

function runDockerCommand(
  args: string[],
  workdir = repoRoot,
  overrides: Record<string, string | undefined> = {},
): SmokeCommandResult {
  const env = { ...process.env };
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) {
      delete env[key];
    } else {
      env[key] = value;
    }
  }

  return spawnSync("docker", args, {
    cwd: workdir,
    env,
    encoding: "utf8",
  });
}

function runLiveComposeCommand(
  sandbox: LiveComposeSandbox,
  args: string[],
  overrides: Record<string, string | undefined> = {},
): SmokeCommandResult {
  return runDockerCommand(
    ["compose", "--project-name", sandbox.projectName, ...args],
    sandbox.rootDir,
    overrides,
  );
}

async function reserveFreePort(): Promise<number> {
  const server = createServer();
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => resolve());
  });

  const address = server.address();
  if (!address || typeof address === "string") {
    await new Promise<void>((resolve) => server.close(() => resolve()));
    throw new Error("failed to reserve TCP port");
  }

  const { port } = address;
  await new Promise<void>((resolve) => server.close(() => resolve()));
  return port;
}

async function createLiveComposeSandbox(): Promise<LiveComposeSandbox> {
  const rootDir = await mkdtemp(join(tmpdir(), "openclaw-live-compose-"));
  const dataDir = join(rootDir, "data");
  const composeTemplate = await readFile(join(repoRoot, "docker-compose.yml"), "utf8");
  const composeWithoutBuild = composeTemplate.replace(/^ {4}build:\n(?:^ {6}.*\n)+/m, "");
  const bridgePort = await reserveFreePort();
  const browserControlPort = await reserveFreePort();
  const gatewayToken = `docker-smoke-${randomUUID()}`;
  const projectName = `openclaw-smoke-${randomUUID().slice(0, 8)}`;

  await mkdir(dataDir, { recursive: true });
  await writeFile(join(rootDir, "docker-compose.yml"), composeWithoutBuild);
  await writeFile(
    join(rootDir, ".env"),
    [
      `OPENCLAW_IMAGE=openclaw:local`,
      `OPENCLAW_GATEWAY_TOKEN=${gatewayToken}`,
      `OPENCLAW_GATEWAY_BIND=lan`,
      `OPENCLAW_BRIDGE_PORT=${bridgePort}`,
      `OPENCLAW_BROWSER_CONTROL_HOST=127.0.0.1`,
      `OPENCLAW_BROWSER_CONTROL_PORT=${browserControlPort}`,
      `DATA_VOLUME_SOURCE=${dataDir}`,
      `OPENCLAW_TZ=UTC`,
      `OPENCLAW_ALLOW_INSECURE_PRIVATE_WS=1`,
    ].join("\n") + "\n",
  );

  return {
    rootDir,
    dataDir,
    projectName,
    bridgePort,
    browserControlPort,
    gatewayToken,
  };
}

async function destroyLiveComposeSandbox(sandbox: LiveComposeSandbox) {
  const hostUid = typeof process.getuid === "function" ? String(process.getuid()) : undefined;
  const hostGid = typeof process.getgid === "function" ? String(process.getgid()) : undefined;

  if (hostUid && hostGid) {
    runLiveComposeCommand(sandbox, [
      "run",
      "--rm",
      "--no-deps",
      "--user",
      "root",
      "--entrypoint",
      "sh",
      "openclaw-gateway",
      "-c",
      `chown -R ${hostUid}:${hostGid} /data || true`,
    ]);
  }

  runLiveComposeCommand(sandbox, ["down", "-v", "--remove-orphans"]);
  await rm(sandbox.rootDir, { recursive: true, force: true });
}

async function waitForGatewayHealthz(
  sandbox: LiveComposeSandbox,
  timeoutMs = 120_000,
): Promise<string> {
  const deadline = Date.now() + timeoutMs;
  let lastFailure = "gateway did not answer";

  while (Date.now() < deadline) {
    const healthzResult = runLiveComposeCommand(sandbox, [
      "exec",
      "-T",
      "openclaw-gateway",
      "node",
      "-e",
      "fetch('http://127.0.0.1:18789/healthz').then(async (response) => { const body = await response.text(); if (!response.ok) { console.error(body); process.exit(1); } process.stdout.write(body); }).catch((error) => { console.error(String(error)); process.exit(1); })",
    ]);
    if (healthzResult.status === 0) {
      return healthzResult.stdout;
    }
    lastFailure =
      `${healthzResult.stderr}${healthzResult.stdout}`.trim() || "gateway /healthz probe failed";

    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }

  throw new Error(`gateway /healthz did not become ready inside compose service: ${lastFailure}`);
}

async function waitForComposeGatewayHealthy(
  sandbox: LiveComposeSandbox,
  timeoutMs = 120_000,
): Promise<string> {
  const deadline = Date.now() + timeoutMs;
  let lastStatus = "unknown";
  let lastOutput = "gateway health status unavailable";

  while (Date.now() < deadline) {
    const containerIdResult = runLiveComposeCommand(sandbox, ["ps", "-q", "openclaw-gateway"]);
    if (containerIdResult.status === 0) {
      const containerId = containerIdResult.stdout.trim();
      if (containerId.length > 0) {
        const inspectResult = runDockerCommand([
          "inspect",
          "--format",
          '{{if .State.Health}}{{.State.Health.Status}}{{else}}no-healthcheck{{end}}\n{{if .State.Health}}{{range .State.Health.Log}}{{.ExitCode}} {{printf "%s" .Output}}{{end}}{{end}}',
          containerId,
        ]);
        if (inspectResult.status === 0) {
          const [statusLine, ...detailLines] = inspectResult.stdout.trim().split("\n");
          lastStatus = statusLine || "unknown";
          lastOutput = detailLines.join("\n").trim() || `gateway health status: ${lastStatus}`;
          if (lastStatus === "healthy") {
            return lastStatus;
          }
        } else {
          lastOutput = `${inspectResult.stderr}${inspectResult.stdout}`.trim() || lastOutput;
        }
      }
    } else {
      lastOutput = `${containerIdResult.stderr}${containerIdResult.stdout}`.trim() || lastOutput;
    }

    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }

  throw new Error(
    `gateway container did not become compose-healthy inside timeout (last status: ${lastStatus}; details: ${lastOutput})`,
  );
}

function runPluginSmokeChecks(
  sandbox: DockerSetupSandbox,
  overrides: Record<string, string | undefined> = {},
) {
  const resolutionResult = runComposeCommand(
    sandbox,
    [
      "run",
      "--rm",
      "--no-deps",
      "openclaw-cli",
      "node",
      "--input-type=module",
      "-e",
      pluginResolutionScript,
    ],
    overrides,
  );
  expect(resolutionResult.status).toBe(0);
  for (const specifier of pluginResolutionSubpaths) {
    expect(resolutionResult.stdout).toContain(`require.resolve('${specifier}') => `);
  }
  assertNoKnownPluginFailures(
    `${resolutionResult.stdout}\n${resolutionResult.stderr}`,
    "plugin resolution smoke output",
  );

  const healthResult = runComposeCommand(
    sandbox,
    [
      "exec",
      "openclaw-gateway",
      "node",
      "dist/index.js",
      "health",
      "--token",
      createEnv(sandbox, overrides).OPENCLAW_GATEWAY_TOKEN ?? "",
    ],
    overrides,
  );
  expect(healthResult.status).toBe(0);
  expect(healthResult.stdout).toContain("Gateway Health");
  expect(healthResult.stdout).toContain("OK");
  assertNoKnownPluginFailures(
    `${healthResult.stdout}\n${healthResult.stderr}`,
    "gateway health output",
  );

  const logsResult = runComposeCommand(sandbox, ["logs", "openclaw-gateway"], overrides);
  expect(logsResult.status).toBe(0);
  assertNoKnownPluginFailures(`${logsResult.stdout}\n${logsResult.stderr}`, "gateway startup logs");

  return { resolutionResult, healthResult, logsResult };
}

async function runLiveComposePluginSmokeChecks(sandbox: LiveComposeSandbox) {
  const upResult = runLiveComposeCommand(sandbox, ["up", "-d", "openclaw-gateway"]);
  expect(upResult.status, upResult.stderr || upResult.stdout).toBe(0);

  const healthzBody = await waitForGatewayHealthz(sandbox);
  const composeHealthStatus = await waitForComposeGatewayHealthy(sandbox);
  expect(healthzBody).toContain("ok");
  expect(composeHealthStatus).toBe("healthy");

  const resolutionResult = runLiveComposeCommand(sandbox, [
    "exec",
    "-T",
    "openclaw-gateway",
    "node",
    "-e",
    `console.log(${JSON.stringify(`require.resolve('${pluginResolutionRegressionSpecifier}') => `)} + require.resolve(${JSON.stringify(pluginResolutionRegressionSpecifier)}));`,
  ]);
  expect(resolutionResult.status, resolutionResult.stderr || resolutionResult.stdout).toBe(0);
  expect(resolutionResult.stdout).toContain(
    `require.resolve('${pluginResolutionRegressionSpecifier}') => `,
  );
  assertNoKnownPluginFailures(
    `${resolutionResult.stdout}\n${resolutionResult.stderr}`,
    "live gateway require.resolve output",
  );

  const logsResult = runLiveComposeCommand(sandbox, ["logs", "--no-color", "openclaw-gateway"]);
  expect(logsResult.status, logsResult.stderr || logsResult.stdout).toBe(0);
  assertNoKnownPluginFailures(
    `${logsResult.stdout}\n${logsResult.stderr}`,
    "live gateway startup logs",
  );

  return { upResult, resolutionResult, logsResult, healthzBody, composeHealthStatus };
}

async function writeDockerStub(binDir: string, logPath: string) {
  const stub = `#!/usr/bin/env bash
set -euo pipefail
log="$DOCKER_STUB_LOG"
fail_match="\${DOCKER_STUB_FAIL_MATCH:-}"
plugin_resolution_output="\${DOCKER_STUB_PLUGIN_RESOLUTION_OUTPUT:-}"
health_output="\${DOCKER_STUB_HEALTH_OUTPUT:-}"
logs_output="\${DOCKER_STUB_GATEWAY_LOGS_OUTPUT:-}"
if [[ "\${1:-}" == "compose" && "\${2:-}" == "version" ]]; then
  exit 0
fi
if [[ "\${1:-}" == "build" ]]; then
  if [[ -n "$fail_match" && "$*" == *"$fail_match"* ]]; then
    echo "build-fail $*" >>"$log"
    exit 1
  fi
  echo "build $*" >>"$log"
  exit 0
fi
if [[ "\${1:-}" == "compose" ]]; then
  if [[ -n "$fail_match" && "$*" == *"$fail_match"* ]]; then
    echo "compose-fail $*" >>"$log"
    exit 1
  fi
  echo "compose $*" >>"$log"
  if [[ "$*" == *" node --input-type=module -e "* ]]; then
    printf '%s' "$plugin_resolution_output"
    exit 0
  fi
  if [[ "$*" == *" exec openclaw-gateway node dist/index.js health --token "* ]]; then
    printf '%s' "$health_output"
    exit 0
  fi
  if [[ "$*" == *" logs openclaw-gateway"* ]]; then
    printf '%s' "$logs_output"
    exit 0
  fi
  exit 0
fi
echo "unknown $*" >>"$log"
exit 0
`;

  await mkdir(binDir, { recursive: true });
  await writeFile(join(binDir, "docker"), stub, { mode: 0o755 });
  await writeFile(logPath, "");
}

async function createDockerSetupSandbox(): Promise<DockerSetupSandbox> {
  const rootDir = await mkdtemp(join(tmpdir(), "openclaw-docker-setup-"));
  const scriptPath = join(rootDir, "docker-setup.sh");
  const dockerfilePath = join(rootDir, "Dockerfile");
  const composePath = join(rootDir, "docker-compose.yml");
  const binDir = join(rootDir, "bin");
  const logPath = join(rootDir, "docker-stub.log");

  await copyFile(join(repoRoot, "docker-setup.sh"), scriptPath);
  await chmod(scriptPath, 0o755);
  await writeFile(dockerfilePath, "FROM scratch\n");
  await writeFile(
    composePath,
    "services:\n  openclaw-gateway:\n    image: noop\n  openclaw-cli:\n    image: noop\n",
  );
  await writeDockerStub(binDir, logPath);

  return { rootDir, scriptPath, logPath, binDir };
}

function createEnv(
  sandbox: DockerSetupSandbox,
  overrides: Record<string, string | undefined> = {},
): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = {
    PATH: `${sandbox.binDir}:${process.env.PATH ?? ""}`,
    HOME: process.env.HOME ?? sandbox.rootDir,
    LANG: process.env.LANG,
    LC_ALL: process.env.LC_ALL,
    TMPDIR: process.env.TMPDIR,
    DOCKER_STUB_LOG: sandbox.logPath,
    OPENCLAW_GATEWAY_TOKEN: "test-token",
    OPENCLAW_CONFIG_DIR: join(sandbox.rootDir, "config"),
    OPENCLAW_WORKSPACE_DIR: join(sandbox.rootDir, "openclaw"),
  };

  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) {
      delete env[key];
    } else {
      env[key] = value;
    }
  }
  return env;
}

function requireSandbox(sandbox: DockerSetupSandbox | null): DockerSetupSandbox {
  if (!sandbox) {
    throw new Error("sandbox missing");
  }
  return sandbox;
}

function runDockerSetup(
  sandbox: DockerSetupSandbox,
  overrides: Record<string, string | undefined> = {},
) {
  return spawnSync("bash", [sandbox.scriptPath], {
    cwd: sandbox.rootDir,
    env: createEnv(sandbox, overrides),
    encoding: "utf8",
    stdio: ["ignore", "ignore", "pipe"],
  });
}

async function withUnixSocket<T>(socketPath: string, run: () => Promise<T>): Promise<T> {
  const server = createServer();
  await new Promise<void>((resolve, reject) => {
    const onError = (error: Error) => {
      server.off("listening", onListening);
      reject(error);
    };
    const onListening = () => {
      server.off("error", onError);
      resolve();
    };
    server.once("error", onError);
    server.once("listening", onListening);
    server.listen(socketPath);
  });

  try {
    return await run();
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
    await rm(socketPath, { force: true });
  }
}

function resolveBashForCompatCheck(): string | null {
  for (const candidate of ["/bin/bash", "bash"]) {
    const probe = spawnSync(candidate, ["-c", "exit 0"], { encoding: "utf8" });
    if (!probe.error && probe.status === 0) {
      return candidate;
    }
  }

  return null;
}

describe("docker-setup.sh", () => {
  let sandbox: DockerSetupSandbox | null = null;

  beforeAll(async () => {
    sandbox = await createDockerSetupSandbox();
  });

  afterAll(async () => {
    if (!sandbox) {
      return;
    }
    await rm(sandbox.rootDir, { recursive: true, force: true });
    sandbox = null;
  });

  it("handles env defaults, home-volume mounts, and Docker build args", async () => {
    const activeSandbox = requireSandbox(sandbox);

    const result = runDockerSetup(activeSandbox, {
      OPENCLAW_DOCKER_APT_PACKAGES: "ffmpeg build-essential",
      OPENCLAW_EXTRA_MOUNTS: undefined,
      OPENCLAW_HOME_VOLUME: "openclaw-home",
    });
    expect(result.status).toBe(0);
    const envFile = await readFile(join(activeSandbox.rootDir, ".env"), "utf8");
    expect(envFile).toContain("OPENCLAW_DOCKER_APT_PACKAGES=ffmpeg build-essential");
    expect(envFile).toContain("OPENCLAW_EXTRA_MOUNTS=");
    expect(envFile).toContain("OPENCLAW_HOME_VOLUME=openclaw-home"); // pragma: allowlist secret
    const extraCompose = await readFile(
      join(activeSandbox.rootDir, "docker-compose.extra.yml"),
      "utf8",
    );
    expect(extraCompose).toContain("openclaw-home:/home/node");
    expect(extraCompose).toContain("volumes:");
    expect(extraCompose).toContain("openclaw-home:");
    const log = await readFile(activeSandbox.logPath, "utf8");
    expect(log).toContain("--build-arg OPENCLAW_DOCKER_APT_PACKAGES=ffmpeg build-essential");
    expect(log).toContain("run --rm openclaw-cli onboard --mode local --no-install-daemon");
    expect(log).toContain("run --rm openclaw-cli config set gateway.mode local");
    expect(log).toContain("run --rm openclaw-cli config set gateway.bind lan");
  });

  it("precreates config identity dir for CLI device auth writes", async () => {
    const activeSandbox = requireSandbox(sandbox);
    const configDir = join(activeSandbox.rootDir, "config-identity");
    const workspaceDir = join(activeSandbox.rootDir, "workspace-identity");

    const result = runDockerSetup(activeSandbox, {
      OPENCLAW_CONFIG_DIR: configDir,
      OPENCLAW_WORKSPACE_DIR: workspaceDir,
    });

    expect(result.status).toBe(0);
    const identityDirStat = await stat(join(configDir, "identity"));
    expect(identityDirStat.isDirectory()).toBe(true);
  });

  it("writes OPENCLAW_TZ into .env when given a real IANA timezone", async () => {
    const activeSandbox = requireSandbox(sandbox);

    const result = runDockerSetup(activeSandbox, {
      OPENCLAW_TZ: "Asia/Shanghai",
    });

    expect(result.status).toBe(0);
    const envFile = await readFile(join(activeSandbox.rootDir, ".env"), "utf8");
    expect(envFile).toContain("OPENCLAW_TZ=Asia/Shanghai");
  });

  it("precreates agent data dirs to avoid EACCES in container", async () => {
    const activeSandbox = requireSandbox(sandbox);
    const configDir = join(activeSandbox.rootDir, "config-agent-dirs");
    const workspaceDir = join(activeSandbox.rootDir, "workspace-agent-dirs");

    const result = runDockerSetup(activeSandbox, {
      OPENCLAW_CONFIG_DIR: configDir,
      OPENCLAW_WORKSPACE_DIR: workspaceDir,
    });

    expect(result.status).toBe(0);
    const agentDirStat = await stat(join(configDir, "agents", "main", "agent"));
    expect(agentDirStat.isDirectory()).toBe(true);
    const sessionsDirStat = await stat(join(configDir, "agents", "main", "sessions"));
    expect(sessionsDirStat.isDirectory()).toBe(true);

    // Verify that a root-user chown step runs before onboarding.
    const log = await readFile(activeSandbox.logPath, "utf8");
    const chownIdx = log.indexOf("--user root");
    const onboardIdx = log.indexOf("onboard");
    expect(chownIdx).toBeGreaterThanOrEqual(0);
    expect(onboardIdx).toBeGreaterThan(chownIdx);
  });

  it("reuses existing config token when OPENCLAW_GATEWAY_TOKEN is unset", async () => {
    const activeSandbox = requireSandbox(sandbox);
    const configDir = join(activeSandbox.rootDir, "config-token-reuse");
    const workspaceDir = join(activeSandbox.rootDir, "workspace-token-reuse");
    await mkdir(configDir, { recursive: true });
    await writeFile(
      join(configDir, "openclaw.json"),
      JSON.stringify({ gateway: { auth: { mode: "token", token: "config-token-123" } } }),
    );

    const result = runDockerSetup(activeSandbox, {
      OPENCLAW_GATEWAY_TOKEN: undefined,
      OPENCLAW_CONFIG_DIR: configDir,
      OPENCLAW_WORKSPACE_DIR: workspaceDir,
    });

    expect(result.status).toBe(0);
    const envFile = await readFile(join(activeSandbox.rootDir, ".env"), "utf8");
    expect(envFile).toContain("OPENCLAW_GATEWAY_TOKEN=config-token-123"); // pragma: allowlist secret
  });

  it("reuses existing .env token when OPENCLAW_GATEWAY_TOKEN and config token are unset", async () => {
    const activeSandbox = requireSandbox(sandbox);
    const configDir = join(activeSandbox.rootDir, "config-dotenv-token-reuse");
    const workspaceDir = join(activeSandbox.rootDir, "workspace-dotenv-token-reuse");
    await mkdir(configDir, { recursive: true });
    await writeFile(
      join(activeSandbox.rootDir, ".env"),
      "OPENCLAW_GATEWAY_TOKEN=dotenv-token-123\nOPENCLAW_GATEWAY_PORT=18789\n", // pragma: allowlist secret
    );

    const result = runDockerSetup(activeSandbox, {
      OPENCLAW_GATEWAY_TOKEN: undefined,
      OPENCLAW_CONFIG_DIR: configDir,
      OPENCLAW_WORKSPACE_DIR: workspaceDir,
    });

    expect(result.status).toBe(0);
    const envFile = await readFile(join(activeSandbox.rootDir, ".env"), "utf8");
    expect(envFile).toContain("OPENCLAW_GATEWAY_TOKEN=dotenv-token-123"); // pragma: allowlist secret
    expect(result.stderr).toBe("");
  });

  it("reuses the last non-empty .env token and strips CRLF without truncating '='", async () => {
    const activeSandbox = requireSandbox(sandbox);
    const configDir = join(activeSandbox.rootDir, "config-dotenv-last-wins");
    const workspaceDir = join(activeSandbox.rootDir, "workspace-dotenv-last-wins");
    await mkdir(configDir, { recursive: true });
    await writeFile(
      join(activeSandbox.rootDir, ".env"),
      [
        "OPENCLAW_GATEWAY_TOKEN=",
        "OPENCLAW_GATEWAY_TOKEN=first-token",
        "OPENCLAW_GATEWAY_TOKEN=last=token=value\r", // pragma: allowlist secret
      ].join("\n"),
    );

    const result = runDockerSetup(activeSandbox, {
      OPENCLAW_GATEWAY_TOKEN: undefined,
      OPENCLAW_CONFIG_DIR: configDir,
      OPENCLAW_WORKSPACE_DIR: workspaceDir,
    });

    expect(result.status).toBe(0);
    const envFile = await readFile(join(activeSandbox.rootDir, ".env"), "utf8");
    expect(envFile).toContain("OPENCLAW_GATEWAY_TOKEN=last=token=value"); // pragma: allowlist secret
    expect(envFile).not.toContain("OPENCLAW_GATEWAY_TOKEN=first-token");
    expect(envFile).not.toContain("\r");
  });

  it("treats OPENCLAW_SANDBOX=0 as disabled", async () => {
    const activeSandbox = requireSandbox(sandbox);
    await writeFile(activeSandbox.logPath, "");

    const result = runDockerSetup(activeSandbox, {
      OPENCLAW_SANDBOX: "0",
    });

    expect(result.status).toBe(0);
    const envFile = await readFile(join(activeSandbox.rootDir, ".env"), "utf8");
    expect(envFile).toContain("OPENCLAW_SANDBOX=");

    const log = await readFile(activeSandbox.logPath, "utf8");
    expect(log).toContain("--build-arg OPENCLAW_INSTALL_DOCKER_CLI=");
    expect(log).not.toContain("--build-arg OPENCLAW_INSTALL_DOCKER_CLI=1");
    expect(log).toContain("config set agents.defaults.sandbox.mode off");
  });

  it("resets stale sandbox mode and overlay when sandbox is not active", async () => {
    const activeSandbox = requireSandbox(sandbox);
    await writeFile(activeSandbox.logPath, "");
    await writeFile(
      join(activeSandbox.rootDir, "docker-compose.sandbox.yml"),
      "services:\n  openclaw-gateway:\n    volumes:\n      - /var/run/docker.sock:/var/run/docker.sock\n",
    );

    const result = runDockerSetup(activeSandbox, {
      OPENCLAW_SANDBOX: "1",
      DOCKER_STUB_FAIL_MATCH: "--entrypoint docker openclaw-gateway --version",
    });

    expect(result.status).toBe(0);
    expect(result.stderr).toContain("Sandbox requires Docker CLI");
    const log = await readFile(activeSandbox.logPath, "utf8");
    expect(log).toContain("config set agents.defaults.sandbox.mode off");
    await expect(stat(join(activeSandbox.rootDir, "docker-compose.sandbox.yml"))).rejects.toThrow();
  });

  it("skips sandbox gateway restart when sandbox config writes fail", async () => {
    const activeSandbox = requireSandbox(sandbox);
    await writeFile(activeSandbox.logPath, "");
    const socketPath = join(activeSandbox.rootDir, "sandbox.sock");

    await withUnixSocket(socketPath, async () => {
      const result = runDockerSetup(activeSandbox, {
        OPENCLAW_SANDBOX: "1",
        OPENCLAW_DOCKER_SOCKET: socketPath,
        DOCKER_STUB_FAIL_MATCH: "config set agents.defaults.sandbox.scope",
      });

      expect(result.status).toBe(0);
      expect(result.stderr).toContain("Failed to set agents.defaults.sandbox.scope");
      expect(result.stderr).toContain("Skipping gateway restart to avoid exposing Docker socket");

      const log = await readFile(activeSandbox.logPath, "utf8");
      const gatewayStarts = log
        .split("\n")
        .filter(
          (line) =>
            line.includes("compose") &&
            line.includes(" up -d") &&
            line.includes("openclaw-gateway"),
        );
      expect(gatewayStarts).toHaveLength(2);
      expect(log).toContain(
        "run --rm --no-deps openclaw-cli config set agents.defaults.sandbox.mode non-main",
      );
      expect(log).toContain("config set agents.defaults.sandbox.mode off");
      const forceRecreateLine = log
        .split("\n")
        .find((line) => line.includes("up -d --force-recreate openclaw-gateway"));
      expect(forceRecreateLine).toBeDefined();
      expect(forceRecreateLine).not.toContain("docker-compose.sandbox.yml");
      await expect(
        stat(join(activeSandbox.rootDir, "docker-compose.sandbox.yml")),
      ).rejects.toThrow();
    });
  });

  it("rejects injected multiline OPENCLAW_EXTRA_MOUNTS values", async () => {
    const activeSandbox = requireSandbox(sandbox);

    const result = runDockerSetup(activeSandbox, {
      OPENCLAW_EXTRA_MOUNTS: "/tmp:/tmp\n  evil-service:\n    image: alpine",
    });

    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("OPENCLAW_EXTRA_MOUNTS cannot contain control characters");
  });

  it("rejects invalid OPENCLAW_EXTRA_MOUNTS mount format", async () => {
    const activeSandbox = requireSandbox(sandbox);

    const result = runDockerSetup(activeSandbox, {
      OPENCLAW_EXTRA_MOUNTS: "bad mount spec",
    });

    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("Invalid mount format");
  });

  it("rejects invalid OPENCLAW_HOME_VOLUME names", async () => {
    const activeSandbox = requireSandbox(sandbox);

    const result = runDockerSetup(activeSandbox, {
      OPENCLAW_HOME_VOLUME: "bad name",
    });

    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("OPENCLAW_HOME_VOLUME must match");
  });

  it("rejects OPENCLAW_TZ values that are not present in zoneinfo", async () => {
    const activeSandbox = requireSandbox(sandbox);

    const result = runDockerSetup(activeSandbox, {
      OPENCLAW_TZ: "Nope/Bad",
    });

    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("OPENCLAW_TZ must match a timezone in /usr/share/zoneinfo");
  });

  it("avoids associative arrays so the script remains Bash 3.2-compatible", async () => {
    const script = await readFile(join(repoRoot, "docker-setup.sh"), "utf8");
    expect(script).not.toMatch(/^\s*declare -A\b/m);

    const systemBash = resolveBashForCompatCheck();
    if (!systemBash) {
      return;
    }

    const assocCheck = spawnSync(systemBash, ["-c", "declare -A _t=()"], {
      encoding: "utf8",
    });
    if (assocCheck.status === 0 || assocCheck.status === null) {
      // Skip runtime check when system bash supports associative arrays
      // (not Bash 3.2) or when /bin/bash is unavailable (e.g. Windows).
      return;
    }

    const syntaxCheck = spawnSync(systemBash, ["-n", join(repoRoot, "docker-setup.sh")], {
      encoding: "utf8",
    });

    expect(syntaxCheck.status).toBe(0);
    expect(syntaxCheck.stderr).not.toContain("declare: -A: invalid option");
  });

  it("keeps docker-compose gateway command in sync", async () => {
    const compose = await readFile(join(repoRoot, "docker-compose.yml"), "utf8");
    expect(compose).not.toContain("gateway-daemon");
    expect(compose).toContain('command: ["/app/scripts/entrypoint.sh"]');
  });

  it("keeps docker-compose CLI network namespace settings in sync", async () => {
    const compose = await readFile(join(repoRoot, "docker-compose.yml"), "utf8");
    expect(compose).toContain('    user: "0:0"');
    expect(compose).toContain('network_mode: "service:openclaw-gateway"');
    expect(compose).toContain(
      "depends_on:\n      openclaw-gateway:\n        condition: service_healthy",
    );
  });

  it("keeps docker-compose gateway healthcheck aligned with /healthz", async () => {
    const compose = await readFile(join(repoRoot, "docker-compose.yml"), "utf8");
    expect(compose).toContain("healthcheck:");
    expect(compose).toContain(
      'test: ["CMD-SHELL", "pgrep -f \'node dist/index.js gateway\' >/dev/null && node -e \\"fetch(\'http://127.0.0.1:18789/healthz\').then((r)=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))\\""]',
    );
    expect(compose).not.toContain("pgrep -f openclaw-gateway");
  });

  it("keeps docker-compose gateway token env defaults aligned across services", async () => {
    const compose = await readFile(join(repoRoot, "docker-compose.yml"), "utf8");
    expect(compose.match(/OPENCLAW_GATEWAY_TOKEN: \$\{OPENCLAW_GATEWAY_TOKEN:-\}/g)).toHaveLength(
      2,
    );
  });

  it("keeps docker-compose timezone env defaults aligned across services", async () => {
    const compose = await readFile(join(repoRoot, "docker-compose.yml"), "utf8");
    expect(compose.match(/TZ: \$\{OPENCLAW_TZ:-UTC\}/g)).toHaveLength(2);
  });

  it("keeps Coolify compose gateway and cli image wiring aligned", async () => {
    const compose = await readFile(join(repoRoot, "docker-compose.coolify.yml"), "utf8");
    expect(compose).toContain("openclaw-gateway:");
    expect(compose).toContain("openclaw-cli:");
    expect(compose).toContain('profiles: ["cli"]');
    expect(compose.match(/image: \$\{OPENCLAW_IMAGE:-openclaw:local\}/g)).toHaveLength(2);
    expect(compose.match(/user: "0:0"/g)).toHaveLength(2);
    expect(compose).toContain('network_mode: "service:openclaw-gateway"');
    expect(compose).not.toContain("condition: service_healthy");
    expect(compose).toContain("healthcheck:");
    expect(compose).toContain("timeout: 10s");
    expect(compose).toContain("retries: 10");
    expect(compose).toContain("start_period: 360s");
    expect(compose).toContain('- "127.0.0.1:18789:18789"');
    expect(compose).not.toContain('- "18789:18789"');
    expect(compose).not.toContain("127.0.0.1:18791:18791");
    expect(compose).toContain("cloudflared:");
    expect(compose).toContain("CLOUDFLARE_TUNNEL_TOKEN");
    expect(compose).toContain("OPENCLAW_PUBLIC_HOSTNAME");
    expect(compose).toContain("restart: on-failure");
    expect(compose).toContain(
      "COPY scripts/cloudflared-entrypoint.sh /usr/local/bin/cloudflared-entrypoint.sh",
    );
    expect(compose).toContain('entrypoint: ["/usr/local/bin/cloudflared-entrypoint.sh"]');
    expect(compose).not.toContain('entrypoint: ["/bin/sh", "-ec"]');
    expect(compose).toContain("http://openclaw-gateway:18789");
    expect(compose).toContain(
      "OPENCLAW_TRUSTED_PROXY_IPS: ${OPENCLAW_CLOUDFLARED_IPV4:-172.30.0.2}",
    );
    expect(compose).toContain("ipv4_address: ${OPENCLAW_GATEWAY_IPV4:-172.30.0.3}");
    expect(compose).toContain("ipv4_address: ${OPENCLAW_CLOUDFLARED_IPV4:-172.30.0.2}");
    expect(compose).not.toContain("localhost:18789");
    expect(compose).not.toContain("service: http://127.0.0.1:18789");
    expect(compose).not.toContain("hostname: $$OPENCLAW_PUBLIC_HOSTNAME");
    expect(compose).not.toContain("OPENCLAW_PUBLIC_HTTP");
    expect(compose).not.toContain('- "80:80"');
    expect(compose).not.toContain('- "443:443"');
  });

  it("locks the intended Coolify tunnel contract for the compose sidecar flow", () => {
    const tokenAbsent = deriveExpectedCoolifyTunnelContract({
      CLOUDFLARE_TUNNEL_TOKEN: "",
      OPENCLAW_PUBLIC_HOSTNAME: "",
    });
    expect(tokenAbsent.gatewayPublishedPorts).toEqual(["127.0.0.1:18789:18789"]);
    expect(tokenAbsent.browserControlPublishedPorts).toEqual([]);
    expect(tokenAbsent.tunnelOriginTarget).toBeUndefined();

    const tokenPresent = deriveExpectedCoolifyTunnelContract({
      CLOUDFLARE_TUNNEL_TOKEN: "test-token",
      OPENCLAW_PUBLIC_HOSTNAME: "my-farm-advisor.superiorbyteworks.com",
    });
    expect(tokenPresent.gatewayPublishedPorts).toEqual(["127.0.0.1:18789:18789"]);
    expect(tokenPresent.browserControlPublishedPorts).toEqual([]);
    expect(tokenPresent.tunnelOriginTarget).toBe("openclaw-gateway:18789");
    expect(tokenPresent.tunnelOriginTarget).not.toContain("127.0.0.1");
    expect(tokenPresent.tunnelOriginTarget).not.toContain("localhost");

    const missingHostname = deriveExpectedCoolifyTunnelContract({
      CLOUDFLARE_TUNNEL_TOKEN: "test-token",
      OPENCLAW_PUBLIC_HOSTNAME: "",
    });
    expect(missingHostname.gatewayPublishedPorts).toEqual(["127.0.0.1:18789:18789"]);
    expect(missingHostname.browserControlPublishedPorts).toEqual([]);
    expect(missingHostname.tunnelOriginTarget).toBe("openclaw-gateway:18789");
  });

  it("extends the local-image smoke path with plugin resolution and startup log checks", async () => {
    const activeSandbox = requireSandbox(sandbox);
    await writeFile(activeSandbox.logPath, "");

    const result = runDockerSetup(activeSandbox);
    expect(result.status).toBe(0);

    const smoke = runPluginSmokeChecks(activeSandbox, {
      DOCKER_STUB_PLUGIN_RESOLUTION_OUTPUT: pluginResolutionSubpaths
        .map(
          (specifier) =>
            `require.resolve('${specifier}') => /app/node_modules/openclaw/dist/${specifier.replace("openclaw/", "")}.js`,
        )
        .join("\n"),
      DOCKER_STUB_HEALTH_OUTPUT: "Gateway Health\nOK (7ms)\n",
      DOCKER_STUB_GATEWAY_LOGS_OUTPUT:
        "[gateway] startup complete\n[plugins] loaded bundled plugins without diagnostics\n",
    });

    const log = await readFile(activeSandbox.logPath, "utf8");
    expect(log).toContain("run --rm openclaw-cli onboard --mode local --no-install-daemon");
    expect(log).toContain("run --rm openclaw-cli config set gateway.mode local");
    expect(log).toContain("run --rm openclaw-cli config set gateway.bind lan");
    expect(log).toContain("up -d openclaw-gateway");
    expect(log).toContain("run --rm --no-deps openclaw-cli node --input-type=module -e");
    expect(log).toContain("exec openclaw-gateway node dist/index.js health --token test-token");
    expect(log).toContain("logs openclaw-gateway");
    expect(smoke.logsResult.stdout).toContain("loaded bundled plugins without diagnostics");
  });

  it("keeps the documented manual compose flow aligned with the operator onboarding path", async () => {
    const activeSandbox = requireSandbox(sandbox);
    await writeFile(activeSandbox.logPath, "");

    const result = runDockerSetup(activeSandbox);
    expect(result.status).toBe(0);

    const smoke = runPluginSmokeChecks(activeSandbox, {
      DOCKER_STUB_PLUGIN_RESOLUTION_OUTPUT: pluginResolutionSubpaths
        .map(
          (specifier) =>
            `require.resolve('${specifier}') => /app/node_modules/openclaw/dist/${specifier.replace("openclaw/", "")}.js`,
        )
        .join("\n"),
      DOCKER_STUB_HEALTH_OUTPUT: "Gateway Health\nOK (7ms)\n",
      DOCKER_STUB_GATEWAY_LOGS_OUTPUT:
        "[gateway] startup complete\n[plugins] loaded bundled plugins without diagnostics\n",
    });

    const documentedLocalImageSequence = [
      "docker build -t openclaw:local -f Dockerfile .",
      "docker compose run --rm openclaw-cli onboard --mode local --no-install-daemon",
      "docker compose run --rm openclaw-cli dashboard --no-open",
    ];
    const documentedStrictManualSequence = [
      "docker build -t openclaw:local -f Dockerfile .",
      "docker compose run --rm openclaw-cli onboard --mode local --no-install-daemon",
      "docker compose run --rm openclaw-cli dashboard --no-open",
    ];
    const readme = await readFile(join(repoRoot, "README.md"), "utf8");
    const installGuide = await readFile(join(repoRoot, "docs/install/docker.md"), "utf8");
    const compose = await readFile(join(repoRoot, "docker-compose.yml"), "utf8");
    const stubLog = await readFile(activeSandbox.logPath, "utf8");
    const executedCommands = extractStubbedCommandSequence(stubLog);
    const readmeCommands = extractMarkdownBashBlock(readme, documentedLocalImageSequence);
    const installGuideCommands = extractMarkdownBashBlock(
      installGuide,
      documentedStrictManualSequence,
    );

    expectOrderedSubsequence(
      readmeCommands,
      documentedLocalImageSequence,
      "README Docker quick start",
    );
    expect(installGuideCommands).toEqual(documentedStrictManualSequence);
    expect(compose).toContain("openclaw-cli:");
    expect(compose).toContain("openclaw-gateway:");
    const buildCommand = executedCommands.find((line) => line.includes("build --build-arg"));
    expect(buildCommand).toBeDefined();
    expect(buildCommand).toContain("-t openclaw:local");
    expect(buildCommand).toContain("Dockerfile");
    expect(buildCommand).not.toContain("compose build");
    expect(
      executedCommands.some((line) =>
        line.includes("run --rm openclaw-cli onboard --mode local --no-install-daemon"),
      ),
    ).toBe(true);
    expect(executedCommands.some((line) => line.includes("up -d openclaw-gateway"))).toBe(true);
    expectOrderedSubsequence(
      executedCommands,
      [
        "up -d openclaw-gateway",
        "run --rm --no-deps openclaw-cli node --input-type=module -e",
        "exec openclaw-gateway node dist/index.js health --token test-token",
        "logs openclaw-gateway",
      ],
      "plugin compatibility smoke flow",
    );
    expect(smoke.resolutionResult.stdout).toContain(
      `require.resolve('${pluginResolutionRegressionSpecifier}') => `,
    );
    expect(smoke.logsResult.stdout).toContain("loaded bundled plugins without diagnostics");
  });

  it("fails the plugin smoke helper when broken plugin resolution or load patterns reappear", () => {
    expect(() =>
      assertNoKnownPluginFailures(
        [
          "[plugins] failed to load plugin: boom (plugin=device-pair, source=/app/extensions/device-pair/index.ts)",
          "Error: Cannot find package 'openclaw/plugin-sdk/device-pair' imported from /app/extensions/device-pair/index.ts",
        ].join("\n"),
        "known broken plugin smoke",
      ),
    ).toThrowError();
  });

  it.skipIf(!liveComposeSmokeEnabled || process.platform === "win32")(
    "reuses the operator docker-compose flow to prove healthz, require.resolve('openclaw/plugin-sdk/core'), and clean startup logs end-to-end",
    async () => {
      const imageResult = runDockerCommand(["image", "inspect", "openclaw:local"]);
      expect(
        imageResult.status,
        "missing local image; build openclaw:local before running this smoke",
      ).toBe(0);

      const liveSandbox = await createLiveComposeSandbox();
      try {
        const smoke = await runLiveComposePluginSmokeChecks(liveSandbox);
        expect(smoke.healthzBody).toContain("ok");
        expect(smoke.composeHealthStatus).toBe("healthy");
        expect(smoke.logsResult.stderr).toBe("");
      } finally {
        await destroyLiveComposeSandbox(liveSandbox);
      }
    },
    180_000,
  );
});
