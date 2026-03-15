#!/bin/bash
set -e

echo "Starting OpenClaw Gateway..."

DATA_MODE="${DATA_MODE:-bind}"
WORKSPACE_DATA_R2_RCLONE_MOUNT="${WORKSPACE_DATA_R2_RCLONE_MOUNT:-0}"
WORKSPACE_DATA_R2_PREFIX="${WORKSPACE_DATA_R2_PREFIX:-workspace/data}"
WORKSPACE_DATA_PATH="/data/workspace/data"
R2_ENDPOINT="${R2_ENDPOINT:-}"

is_truthy() {
    case "$1" in
        1|true|TRUE|True|yes|YES|on|ON)
            return 0
            ;;
        *)
            return 1
            ;;
    esac
}

log_storage_mode() {
    case "$DATA_MODE" in
        volume|VOLUME)
            echo "DATA_MODE=volume (managed Docker volume)"
            ;;
        bind|local|BIND|LOCAL|"")
            DATA_MODE="bind"
            echo "DATA_MODE=bind (host directory mount)"
            ;;
        *)
            echo "DATA_MODE=$DATA_MODE (custom)"
            ;;
    esac
}

if [ -z "$R2_ENDPOINT" ] && [ -n "$CF_ACCOUNT_ID" ]; then
    R2_ENDPOINT="https://${CF_ACCOUNT_ID}.r2.cloudflarestorage.com"
fi

log_storage_mode

mkdir -p /data

echo "Setting up workspace directories..."
if ! mkdir -p /data/workspace/skills /data/workspace/.openclaw /data/workspace/data; then
    echo "Unable to create workspace directories under /data/workspace"
    exit 1
fi

workspace_data_mount_requested=0
if is_truthy "$WORKSPACE_DATA_R2_RCLONE_MOUNT"; then
    workspace_data_mount_requested=1
fi

if [ $workspace_data_mount_requested -eq 1 ]; then
    if [ -z "$R2_BUCKET_NAME" ] || [ -z "$R2_ACCESS_KEY_ID" ] || [ -z "$R2_SECRET_ACCESS_KEY" ] || [ -z "$R2_ENDPOINT" ]; then
        echo "WORKSPACE_DATA_R2_RCLONE_MOUNT is enabled but R2 credentials are incomplete; exiting"
        exit 1
    fi

    export AWS_ACCESS_KEY_ID="$R2_ACCESS_KEY_ID"
    export AWS_SECRET_ACCESS_KEY="$R2_SECRET_ACCESS_KEY"
    export AWS_EC2_METADATA_DISABLED=true
    export AWS_DEFAULT_REGION="${AWS_DEFAULT_REGION:-auto}"

    sync_skills_on_start=0
    if is_truthy "${OPENCLAW_SYNC_SKILLS_ON_START:-}"; then
        sync_skills_on_start=1
    fi

    if [ $sync_skills_on_start -eq 1 ]; then
        LOCAL_SKILLS_MANIFEST="${OPENCLAW_LOCAL_SKILLS_MANIFEST_PATH:-/app/skills-manifest.json}"
        REMOTE_SKILLS_MANIFEST_OBJECT="${OPENCLAW_SKILLS_MANIFEST_OBJECT:-workspace/.skills-manifest.json}"
        REMOTE_SKILLS_PREFIX="${OPENCLAW_REMOTE_SKILLS_PREFIX:-workspace/skills}"
        SKILL_SYNC_STRATEGY="${OPENCLAW_SKILL_SYNC_STRATEGY:-auto}"
        FORCE_SKILL_SYNC="${OPENCLAW_FORCE_SKILL_SYNC:-0}"
        SKIP_REMOTE_SKILL_SYNC=0

        if [ -f "$LOCAL_SKILLS_MANIFEST" ] && command -v aws >/dev/null 2>&1 && [ "$SKILL_SYNC_STRATEGY" != "fuse" ]; then
            REMOTE_MANIFEST_PATH=/tmp/remote-skills-manifest.json
            if [ "$FORCE_SKILL_SYNC" != "1" ]; then
                if aws s3 cp "s3://$R2_BUCKET_NAME/$REMOTE_SKILLS_MANIFEST_OBJECT" "$REMOTE_MANIFEST_PATH" --endpoint-url "$R2_ENDPOINT" --no-progress --only-show-errors >/dev/null 2>&1; then
                    if cmp -s "$LOCAL_SKILLS_MANIFEST" "$REMOTE_MANIFEST_PATH"; then
                        echo "Remote skills manifest matches bundled skills; skipping upload"
                        SKIP_REMOTE_SKILL_SYNC=1
                    fi
                fi
            fi

            if [ "$SKIP_REMOTE_SKILL_SYNC" != "1" ]; then
                echo "Uploading bundled skills to R2 via aws s3 sync..."
                if aws s3 sync /app/skills "s3://$R2_BUCKET_NAME/$REMOTE_SKILLS_PREFIX" --endpoint-url "$R2_ENDPOINT" --delete --exact-timestamps --no-progress --only-show-errors; then
                    aws s3 cp "$LOCAL_SKILLS_MANIFEST" "s3://$R2_BUCKET_NAME/$REMOTE_SKILLS_MANIFEST_OBJECT" --endpoint-url "$R2_ENDPOINT" --no-progress --only-show-errors >/dev/null 2>&1 || true
                else
                    echo "aws s3 sync failed; continuing without remote skill seed"
                fi
            fi
        fi
    else
        echo "Skipping bundled skill upload (OPENCLAW_SYNC_SKILLS_ON_START disabled)"
    fi

    RCLONE_VFS_CACHE_SIZE="${RCLONE_VFS_CACHE_SIZE:-20G}"
    RCLONE_VFS_CACHE_MAX_AGE="${RCLONE_VFS_CACHE_MAX_AGE:-1h}"

    cat > /tmp/rclone.conf <<EOF
[r2]
type = s3
provider = Cloudflare
endpoint = ${R2_ENDPOINT}
access_key_id = ${R2_ACCESS_KEY_ID}
secret_access_key = ${R2_SECRET_ACCESS_KEY}
region = auto
acl = private
EOF

    RCLONE_OPTS=(
        --config /tmp/rclone.conf
        --vfs-cache-mode full
        --vfs-cache-max-size "$RCLONE_VFS_CACHE_SIZE"
        --vfs-cache-max-age "$RCLONE_VFS_CACHE_MAX_AGE"
        --vfs-cache-poll-interval 30s
        --dir-cache-time 1h
        --poll-interval 30s
        --allow-other
        --uid 1000
        --gid 1000
        --umask 0022
        --daemon
    )

    mkdir -p "$WORKSPACE_DATA_PATH"
    fusermount -u "$WORKSPACE_DATA_PATH" 2>/dev/null || true
    fusermount -uz "$WORKSPACE_DATA_PATH" 2>/dev/null || true

    SANITIZED_PREFIX="${WORKSPACE_DATA_R2_PREFIX#/}"
    SANITIZED_PREFIX="${SANITIZED_PREFIX%/}"
    MOUNT_SOURCE="r2:/$R2_BUCKET_NAME"
    if [ -n "$SANITIZED_PREFIX" ]; then
        MOUNT_SOURCE="r2:/$R2_BUCKET_NAME/$SANITIZED_PREFIX"
    fi

    echo "Mounting workspace data from $MOUNT_SOURCE to $WORKSPACE_DATA_PATH"
    if ! rclone mount "$MOUNT_SOURCE" "$WORKSPACE_DATA_PATH" "${RCLONE_OPTS[@]}" 2>&1; then
        echo "Failed to mount workspace data from R2; exiting"
        exit 1
    fi

    sleep 2
    if ! ls "$WORKSPACE_DATA_PATH" >/dev/null 2>&1; then
        echo "R2 workspace data mount appears unhealthy; exiting"
        exit 1
    fi
    echo "Workspace data mount ready at $WORKSPACE_DATA_PATH"
else
    mkdir -p "$WORKSPACE_DATA_PATH"
fi

node <<'EOF'
const fs = require('fs');

const configPath = '/data/openclaw.json';
let config = {};

try {
  config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} catch {
  config = {};
}

const fieldOpsTelegramToken = process.env.TELEGRAM_FIELD_OPERATIONS_BOT_TOKEN?.trim();
const dataPipelineTelegramToken = process.env.TELEGRAM_DATA_PIPELINE_BOT_TOKEN?.trim();

const parseAllowList = value => {
  if (!value) return [];
  return value
    .split(/[\s,]+/)
    .map(entry => entry.trim())
    .filter(Boolean)
    .map(entry => entry.replace(/^(telegram:|tg:)/i, ''));
};

const mergeAllowFrom = (...lists) => {
  const unique = new Set();
  for (const list of lists) {
    if (!Array.isArray(list)) continue;
    for (const entry of list) {
      if (entry) unique.add(entry);
    }
  }
  return unique.size > 0 ? Array.from(unique) : undefined;
};

const sharedAllowFrom = parseAllowList(process.env.TELEGRAM_ALLOWED_USERS);
const fieldOpsAllowFrom = parseAllowList(process.env.TELEGRAM_FIELD_OPERATIONS_ALLOWED_USERS);
const dataPipelineAllowFrom = parseAllowList(
  process.env.TELEGRAM_DATA_PIPELINE_BOT_ALLOWED_USERS ?? process.env.TELEGRAM_DATA_PIPELINE_ALLOWED_USERS,
);

const parseBooleanEnv = value => {
  if (value === undefined || value === null) return null;
  const normalized = value.trim().toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
  return null;
};

const { execSync } = require('child_process');
const shouldResetPollingRaw = process.env.TELEGRAM_FORCE_POLLING_RESET ?? '';
const shouldResetPolling = parseBooleanEnv(shouldResetPollingRaw) ?? false;

const clearTelegramWebhook = (token, label) => {
  if (!token) {
    return;
  }
  try {
    const encoded = encodeURIComponent(token);
    try {
      execSync(
        `curl -sS --max-time 5 "https://api.telegram.org/bot${encoded}/getUpdates?offset=-1&limit=1&timeout=0" >/dev/null`,
        { stdio: 'ignore' },
      );
    } catch (prefetchErr) {
      console.warn(`Warning: unable to prefetch getUpdates for ${label}: ${prefetchErr.message}`);
    }
    execSync(
      `curl -sSf --max-time 5 "https://api.telegram.org/bot${encoded}/deleteWebhook?drop_pending_updates=true" >/dev/null`,
      { stdio: 'ignore' },
    );
  } catch (err) {
    console.warn(`Warning: unable to clear Telegram webhook for ${label}: ${err.message}`);
  }
};

if (!shouldResetPolling) {
  clearTelegramWebhook(fieldOpsTelegramToken, 'main');
  clearTelegramWebhook(dataPipelineTelegramToken, 'data-pipeline');
}

const resetTelegramPollingSession = (token, label) => {
  if (!token) {
    return;
  }
  const encoded = encodeURIComponent(token);
  const callApi = (method, query = '') => {
    try {
      execSync(`curl -sS --max-time 5 "https://api.telegram.org/bot${encoded}/${method}${query}" >/dev/null`, {
        stdio: 'ignore',
      });
      return true;
    } catch (err) {
      console.warn(`Warning: Telegram ${method} for ${label} failed: ${err.message}`);
      return false;
    }
  };

  const loggedOut = callApi('logOut');
  if (!loggedOut) {
    callApi('close');
  }
  // Re-authorize session to prevent deleteWebhook 400 errors on startup.
  callApi('getUpdates', '?offset=-1&limit=1&timeout=0');
};

if (shouldResetPolling) {
  resetTelegramPollingSession(fieldOpsTelegramToken, 'main');
  resetTelegramPollingSession(dataPipelineTelegramToken, 'data-pipeline');
}

const gatewayToken = process.env.OPENCLAW_GATEWAY_TOKEN?.trim();

config.gateway ??= {};
config.gateway.controlUi ??= {};
config.gateway.controlUi.allowedOrigins ??= [
  'http://127.0.0.1:18789',
  'http://localhost:18789',
];
if (config.gateway.controlUi.allowInsecureAuth === undefined) {
  config.gateway.controlUi.allowInsecureAuth = true;
}
if (config.gateway.controlUi.dangerouslyAllowHostHeaderOriginFallback === undefined) {
  config.gateway.controlUi.dangerouslyAllowHostHeaderOriginFallback = false;
}

config.gateway.auth ??= {};
if (gatewayToken) {
  config.gateway.auth.mode = 'token';
  config.gateway.auth.token = gatewayToken;
} else if (!config.gateway.auth.mode) {
  config.gateway.auth.mode = 'token';
}
const gatewayModeEnv = process.env.OPENCLAW_GATEWAY_MODE?.trim();
if (!config.gateway.mode) {
  config.gateway.mode = gatewayModeEnv || 'local';
}

const telegramGroupPolicy = process.env.OPENCLAW_TELEGRAM_GROUP_POLICY?.trim();
if (telegramGroupPolicy) {
  config.channels ??= {};
  config.channels.telegram ??= {};
  config.channels.telegram.groupPolicy = telegramGroupPolicy;
}

config.channels ??= {};
const telegramConfig = (config.channels.telegram ??= {});
if (process.env.TELEGRAM_FIELD_OPERATIONS_BOT_TOKEN || process.env.TELEGRAM_DATA_PIPELINE_BOT_TOKEN) {
  telegramConfig.enabled ??= true;
}
telegramConfig.dmPolicy ??= 'pairing';
if (telegramConfig.defaultAccount === undefined && typeof telegramConfig.defaultAccountId === 'string') {
  telegramConfig.defaultAccount = telegramConfig.defaultAccountId;
}
delete telegramConfig.defaultAccountId;
telegramConfig.defaultAccount ??= 'main';
const hasAnyAccountAllowFrom =
  sharedAllowFrom.length > 0 || fieldOpsAllowFrom.length > 0 || dataPipelineAllowFrom.length > 0;
const normalizedGroupPolicy = (() => {
  const normalized = telegramGroupPolicy ? telegramGroupPolicy.toLowerCase() : undefined;
  const validPolicies = new Set(['open', 'allowlist', 'disabled']);
  if (normalized && validPolicies.has(normalized)) {
    if (normalized === 'open' && hasAnyAccountAllowFrom) {
      return 'allowlist';
    }
    return normalized;
  }
  return hasAnyAccountAllowFrom ? 'allowlist' : 'open';
})();
telegramConfig.groupPolicy = normalizedGroupPolicy;
telegramConfig.streaming ??= 'partial';
delete telegramConfig.botToken;
delete telegramConfig.tokenFile;
telegramConfig.commands ??= {};
if (telegramConfig.commands.native === undefined) {
  telegramConfig.commands.native = false;
}
if (hasAnyAccountAllowFrom) {
  const combinedAllowFrom = mergeAllowFrom(
    telegramConfig.allowFrom,
    sharedAllowFrom,
    fieldOpsAllowFrom,
    dataPipelineAllowFrom,
  );
  if (combinedAllowFrom) {
    telegramConfig.allowFrom = combinedAllowFrom;
  }
  telegramConfig.dmPolicy = 'allowlist';
}
const telegramAccounts = (telegramConfig.accounts ??= {});
telegramAccounts.default = {
  ...(telegramAccounts.default ?? {}),
  enabled: false,
  dmPolicy: telegramConfig.dmPolicy,
  groupPolicy: normalizedGroupPolicy,
  streaming: telegramConfig.streaming,
};
if (hasAnyAccountAllowFrom) {
  const defaultAllowFrom = mergeAllowFrom(
    telegramAccounts.default?.allowFrom,
    sharedAllowFrom,
    fieldOpsAllowFrom,
    dataPipelineAllowFrom,
  );
  if (defaultAllowFrom) {
    telegramAccounts.default.allowFrom = defaultAllowFrom;
  }
  telegramAccounts.default.dmPolicy = 'allowlist';
  telegramAccounts.default.groupPolicy = 'allowlist';
}
if (fieldOpsTelegramToken) {
  const account = {
    ...(telegramAccounts.main ?? {}),
    name: telegramAccounts.main?.name ?? 'Field Operations Bot',
    botToken: fieldOpsTelegramToken,
    groupPolicy: telegramAccounts.main?.groupPolicy ?? normalizedGroupPolicy,
    streaming: telegramAccounts.main?.streaming ?? telegramConfig.streaming,
  };
  if (fieldOpsAllowFrom.length > 0) {
    account.allowFrom = mergeAllowFrom(account.allowFrom, fieldOpsAllowFrom, sharedAllowFrom);
    account.dmPolicy = 'allowlist';
    account.groupPolicy = 'allowlist';
  } else if (hasAnyAccountAllowFrom && !account.allowFrom) {
    account.allowFrom = telegramConfig.allowFrom;
    account.dmPolicy ??= 'allowlist';
    account.groupPolicy ??= normalizedGroupPolicy;
  }
  telegramAccounts.main = account;
}
if (dataPipelineTelegramToken) {
  const accountKey = 'data-pipeline';
  const account = {
    ...(telegramAccounts[accountKey] ?? {}),
    name: telegramAccounts[accountKey]?.name ?? 'Data Pipeline Bot',
    botToken: dataPipelineTelegramToken,
    groupPolicy: telegramAccounts[accountKey]?.groupPolicy ?? normalizedGroupPolicy,
    streaming: telegramAccounts[accountKey]?.streaming ?? telegramConfig.streaming,
  };
  if (dataPipelineAllowFrom.length > 0) {
    account.allowFrom = mergeAllowFrom(account.allowFrom, dataPipelineAllowFrom, sharedAllowFrom);
    account.dmPolicy = 'allowlist';
    account.groupPolicy = 'allowlist';
  } else if (hasAnyAccountAllowFrom && !account.allowFrom) {
    account.allowFrom = telegramConfig.allowFrom;
    account.dmPolicy ??= 'allowlist';
    account.groupPolicy ??= normalizedGroupPolicy;
  }
  telegramAccounts[accountKey] = account;
}

config.plugins ??= {};
config.plugins.entries ??= {};
if (!config.plugins.entries['qwen-portal-auth']) {
  config.plugins.entries['qwen-portal-auth'] = { enabled: true };
}

config.agents ??= {};
config.agents.defaults ??= {};
config.agents.defaults.workspace ??= '/data/workspace';
const memorySearchEnv = process.env.OPENCLAW_MEMORY_SEARCH_ENABLED?.trim();
config.agents.defaults.memorySearch ??= {};
if (memorySearchEnv !== undefined) {
  config.agents.defaults.memorySearch.enabled = memorySearchEnv === '1' || memorySearchEnv?.toLowerCase() === 'true';
} else if (config.agents.defaults.memorySearch.enabled === undefined) {
  config.agents.defaults.memorySearch.enabled = false;
}

config.agents.list ??= [];

const nowIso = new Date().toISOString();
config.meta ??= {};
config.meta.lastTouchedVersion ??= '2026.3.13';
config.meta.lastTouchedAt = nowIso;
config.wizard ??= {};
config.wizard.lastRunVersion ??= '2026.3.13';
config.wizard.lastRunCommand ??= 'entrypoint';
config.wizard.lastRunMode ??= 'local';
config.wizard.lastRunAt = nowIso;

const ensureAgent = (id, baseConfig) => {
  const list = config.agents.list ?? [];
  const index = list.findIndex(entry => entry && typeof entry === 'object' && entry.id === id);
  const normalizeIdentity = (defaults, existing) => {
    const merged = { ...(defaults ?? {}), ...(existing ?? {}) };
    const keys = Object.keys(merged);
    if (keys.length === 0) {
      return undefined;
    }
    return merged;
  };

  if (index === -1) {
    const created = {
      ...baseConfig,
      identity: normalizeIdentity(baseConfig.identity, undefined),
    };
    config.agents.list.push(created);
    return created;
  }

  const existing = list[index] ?? {};
  const merged = {
    ...baseConfig,
    ...existing,
  };
  merged.workspace = existing.workspace ?? baseConfig.workspace;
  merged.name = existing.name ?? baseConfig.name;
  merged.default = existing.default ?? baseConfig.default;
  merged.identity = normalizeIdentity(baseConfig.identity, existing.identity);
  merged.model = existing.model ?? baseConfig.model;
  config.agents.list[index] = merged;
  return merged;
};

ensureAgent('main', {
  id: 'main',
  default: true,
  name: 'Field Operations Agent',
  workspace: '/data/workspace',
});

ensureAgent('data-pipeline', {
  id: 'data-pipeline',
  name: 'Data Pipeline Agent',
  workspace: '/data/workspace-data-pipeline',
  identity: {
    name: 'My Farm Advisor – Data Pipeline Agent',
    emoji: '🔄',
  },
});

const primaryModel = process.env.PRIMARY_MODEL?.trim();
const fallbackModels = process.env.FALLBACK_MODELS?.trim();
const allModels = [];
if (primaryModel) allModels.push(primaryModel);
if (fallbackModels) {
  fallbackModels
    .split(',')
    .map(m => m.trim())
    .filter(m => m && !allModels.includes(m))
    .forEach(m => allModels.push(m));
}

if (allModels.length > 0) {
  config.agents ??= {};
  config.agents.defaults ??= {};
  config.agents.defaults.models ??= {};
  allModels.forEach(m => {
    const name = m.split('/').pop() ?? m;
    config.agents.defaults.models[m] ??= { alias: name };
  });
}

const nvidiaApiKey = process.env.NVIDIA_API_KEY?.trim();
const nvidiaBaseUrl = process.env.NVIDIA_BASE_URL?.trim();
const INTEGRATE_MODEL_PREFIXES = new Set(['nvidia', 'stepfun-ai']);
const normalizeIntegrateModelId = id => {
  if (typeof id !== 'string') return id;
  if (id.startsWith('nvidia/stepfun-ai/')) {
    return id.replace('nvidia/stepfun-ai/', 'stepfun-ai/');
  }
  if (id.startsWith('nvidia/qwen/')) {
    return id.replace('nvidia/qwen/', 'qwen/');
  }
  if (id.startsWith('nvidia/moonshotai/')) {
    return id.replace('nvidia/moonshotai/', 'moonshotai/');
  }
  return id;
};
const integrateModels = allModels.filter(modelRef => {
  const providerPrefix = modelRef.split('/')[0];
  return INTEGRATE_MODEL_PREFIXES.has(providerPrefix) || modelRef.startsWith('stepfun-ai/');
});
if (nvidiaApiKey && nvidiaBaseUrl && integrateModels.length > 0) {
  config.models ??= {};
  config.models.mode ??= 'merge';
  config.models.providers ??= {};
  const modelsByProvider = new Map();
  for (const rawModelId of integrateModels) {
    const normalizedId = normalizeIntegrateModelId(rawModelId);
    const providerId = normalizedId.split('/')[0];
    if (!modelsByProvider.has(providerId)) {
      modelsByProvider.set(providerId, []);
    }
    const name = normalizedId.split('/').pop() ?? normalizedId;
    modelsByProvider.get(providerId).push({ id: normalizedId, name });
  }

  for (const [providerId, providerModels] of modelsByProvider.entries()) {
    const existingProvider = config.models.providers[providerId] ?? {};
    const existingModelsArray = Array.isArray(existingProvider.models)
      ? existingProvider.models.map(model => {
          const normalizedId = normalizeIntegrateModelId(model?.id ?? '');
          const name = model?.name ?? normalizedId.split('/').pop() ?? normalizedId;
          return { ...model, id: normalizedId, name };
        })
      : [];
    const existingModelMap = new Map();
    for (const model of existingModelsArray) {
      if (model?.id && !existingModelMap.has(model.id)) {
        existingModelMap.set(model.id, model);
      }
    }
    for (const model of providerModels) {
      if (!existingModelMap.has(model.id)) {
        existingModelMap.set(model.id, model);
      }
    }
    config.models.providers[providerId] = {
      ...existingProvider,
      baseUrl: nvidiaBaseUrl,
      api: 'openai-completions',
      auth: 'api-key',
      apiKey: 'secretref-env:NVIDIA_API_KEY',
      models: Array.from(existingModelMap.values()),
    };
  }
}

if (config.models && typeof config.models === 'object') {
  const providers = config.models.providers;
  if (providers && typeof providers === 'object') {
    const providerKeys = Object.keys(providers);
    const hasInvalidProvider = providerKeys.some(key => {
      const entry = providers[key];
      return entry && typeof entry === 'object' && !('baseUrl' in entry);
    });
    if (hasInvalidProvider) {
      delete config.models;
    }
  }
}

if (primaryModel) {
  config.agents ??= {};
  config.agents.defaults ??= {};
  config.agents.defaults.model ??= {};
  config.agents.defaults.model.primary = primaryModel;
  if (fallbackModels) {
    config.agents.defaults.model.fallbacks = fallbackModels.split(',').map(m => m.trim()).filter(m => m);
  }
}

if (Array.isArray(config.agents?.list) && primaryModel) {
  const TARGET_AGENT_IDS = new Set(['main', 'data-pipeline']);
  config.agents.list = config.agents.list.map(entry => {
    if (entry && typeof entry === 'object' && TARGET_AGENT_IDS.has(entry.id)) {
      return { ...entry, model: primaryModel };
    }
    return entry;
  });
}

fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
try {
  fs.chmodSync(configPath, 0o600);
} catch (err) {
  console.warn(`Warning: unable to set permissions on ${configPath}: ${err.message}`);
}

const fieldOpsTelegramPairingCode = process.env.TELEGRAM_FIELD_OPERATIONS_BOT_PAIRING_CODE?.trim();
const dataPipelineTelegramPairingCode = process.env.TELEGRAM_DATA_PIPELINE_BOT_PAIRING_CODE?.trim();
if (!hasAnyAccountAllowFrom) {
  const pairingQueue = [];
  if (fieldOpsTelegramPairingCode) {
    pairingQueue.push({ account: 'main', code: fieldOpsTelegramPairingCode });
  }
  if (dataPipelineTelegramPairingCode) {
    pairingQueue.push({ account: 'data-pipeline', code: dataPipelineTelegramPairingCode });
  }

  for (const entry of pairingQueue) {
    try {
      execSync(`node /app/openclaw.mjs pairing approve telegram --account ${entry.account} ${entry.code}`, {
        stdio: 'inherit',
      });
    } catch (err) {
      console.warn(
        `Warning: unable to approve Telegram pairing for account "${entry.account}": ${err.message}`,
      );
    }
  }
}
EOF

for file in SOUL.md USER.md AGENTS.md TOOLS.md IDENTITY.md IDENTITY.data-pipeline.md; do
    if [ -f "/app/$file" ] && [ ! -e "/data/workspace/$file" ]; then
        cp "/app/$file" "/data/workspace/$file"
    fi
done

PIPELINE_WORKSPACE="/data/workspace-data-pipeline"
mkdir -p "$PIPELINE_WORKSPACE"
for file in SOUL.md USER.md AGENTS.md TOOLS.md; do
    if [ -f "/app/$file" ] && [ ! -e "$PIPELINE_WORKSPACE/$file" ]; then
        cp "/app/$file" "$PIPELINE_WORKSPACE/$file"
    fi
done
if [ -f "/app/IDENTITY.data-pipeline.md" ] && [ ! -e "$PIPELINE_WORKSPACE/IDENTITY.md" ]; then
    cp "/app/IDENTITY.data-pipeline.md" "$PIPELINE_WORKSPACE/IDENTITY.md"
fi

for file in IDENTITY HEARTBEAT BOOT BOOTSTRAP; do
    template="/app/$file.md.template"
    target="/data/workspace/$file.md"
    if [ -f "$template" ] && [ ! -e "$target" ]; then
        cp "$template" "$target"
    fi
done

SYNC_SKILLS_ON_START="${OPENCLAW_SYNC_SKILLS_ON_START:-}"
if [ -z "$SYNC_SKILLS_ON_START" ]; then
    SYNC_SKILLS_ON_START=1
fi
if [ "$SKIP_FUSE_SKILL_SYNC" = "1" ]; then
    SYNC_SKILLS_ON_START=0
fi
SYNC_SKILLS_OVERWRITE="${OPENCLAW_SYNC_SKILLS_OVERWRITE:-1}"
SYNC_SKILLS_RETRIES="${OPENCLAW_SYNC_SKILLS_RETRIES:-3}"

copy_skill_dir() {
    local src="$1"
    local dest="$2"
    local label="$3"

    if [ ! -d "$src" ] || [ ! -f "$src/SKILL.md" ]; then
        return 0
    fi

    if [ "$SYNC_SKILLS_OVERWRITE" = "1" ] && [ -e "$dest" ]; then
        rm -rf "$dest"
    fi

    mkdir -p "$dest"

    local attempt=1
    while [ "$attempt" -le "$SYNC_SKILLS_RETRIES" ]; do
        if command -v rsync >/dev/null 2>&1; then
            if rsync -a --delete "$src/" "$dest"; then
                return 0
            fi
        else
            if cp -R "$src/." "$dest/"; then
                return 0
            fi
        fi
        echo "Skill sync attempt $attempt failed for $label; retrying..." >&2
        if [ "$SYNC_SKILLS_OVERWRITE" = "1" ]; then
            rm -rf "$dest"
            mkdir -p "$dest"
        fi
        attempt=$((attempt + 1))
        sleep $((attempt * 2))
    done

    echo "Skill sync failed for $label" >&2
    return 1
}

if [ "$SYNC_SKILLS_ON_START" = "1" ]; then
    echo "Syncing skills to workspace..."
    for name in my-farm-advisor my-farm-breeding-trial-management my-farm-qtl-analysis superior-byte-works-google-timesfm-forecasting superior-byte-works-wrighter; do
        dir=/app/skills/$name
        target=/data/workspace/skills/$name
        if ! copy_skill_dir "$dir" "$target" "$name"; then
            exit 1
        fi
    done

    if [ -d "/app/skills/k-dense/scientific-skills" ]; then
        for dir in /app/skills/k-dense/scientific-skills/*/; do
            name=$(basename "$dir")
            target=/data/workspace/skills/$name
            if [ "$name" != "offer-k-dense-web" ]; then
                if ! copy_skill_dir "$dir" "$target" "$name"; then
                    exit 1
                fi
            fi
        done
    fi

    if [ -d "/app/skills/antigravity/skills" ]; then
        for dir in /app/skills/antigravity/skills/*/; do
            name=$(basename "$dir")
            target=/data/workspace/skills/$name
            if [ "$name" != "claude-scientific-tools" ]; then
                if ! copy_skill_dir "$dir" "$target" "$name"; then
                    exit 1
                fi
            fi
        done
    fi
else
    echo "Skipping startup skill sync (OPENCLAW_SYNC_SKILLS_ON_START=$SYNC_SKILLS_ON_START)"
fi

echo "Starting gateway..."
exec node dist/index.js gateway --bind ${OPENCLAW_GATEWAY_BIND:-lan} --port 18789 --allow-unconfigured
