#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DATA_ROOT="${FRESH_BOOTSTRAP_DATA_ROOT:-${ROOT_DIR}/data}"
WORKSPACE_DIR="${DATA_ROOT}/workspace"
PIPELINE_DIR="${DATA_ROOT}/workspace-data-pipeline"
PRESERVE_NAMES=(data .venv)

info() {
  printf "[fresh-bootstrap] %s\n" "$*"
}

warn() {
  printf "[fresh-bootstrap] WARNING: %s\n" "$*" >&2
}

remove_path() {
  local target="$1"
  if rm -rf "$target" 2>/dev/null; then
    return 0
  fi
  if command -v sudo >/dev/null 2>&1; then
    if sudo -n rm -rf "$target" 2>/dev/null; then
      return 0
    fi
  fi
  if command -v docker >/dev/null 2>&1; then
    if [[ "$target" == "$DATA_ROOT"* ]]; then
      local rel="${target#$DATA_ROOT/}"
      local container_target="/data/${rel}"
      if docker compose run --rm --no-deps -T openclaw-gateway sh -c "rm -rf -- \"$container_target\"" >/dev/null 2>&1; then
        return 0
      fi
    fi
  fi
  warn "Unable to remove $target"
  return 1
}

ensure_dir() {
  local dir="$1"
  if [ ! -d "$dir" ]; then
    warn "Directory not found: $dir"
    return 1
  fi
  return 0
}

purge_workspace_dir() {
  local dir="$1"
  if ! ensure_dir "$dir"; then
    return
  fi

  info "Clearing workspace contents in $dir"

  local preserve_expr=()
  if [ ${#PRESERVE_NAMES[@]} -gt 0 ]; then
    for keep in "${PRESERVE_NAMES[@]}"; do
      preserve_expr+=( -name "$keep" -o )
    done
    local last_index=$(( ${#preserve_expr[@]} - 1 ))
    unset preserve_expr[$last_index]
  fi

  if [ ${#preserve_expr[@]} -gt 0 ]; then
    while IFS= read -r -d '' path; do
      remove_path "$path"
    done < <(find "$dir" -mindepth 1 -maxdepth 1 \( "${preserve_expr[@]}" \) -prune -o -print0)
  else
    while IFS= read -r -d '' path; do
      remove_path "$path"
    done < <(find "$dir" -mindepth 1 -maxdepth 1 -print0)
  fi
}

purge_openclaw_config() {
  local config_path="$DATA_ROOT/openclaw.json"
  if [ -f "$config_path" ]; then
    info "Removing $config_path"
    remove_path "$config_path"
  else
    info "openclaw.json not present, nothing to remove"
  fi

  while IFS= read -r -d '' backup; do
    remove_path "$backup"
  done < <(find "$DATA_ROOT" -maxdepth 1 -type f -name 'openclaw.json.bak*' -print0 2>/dev/null)
}

docker_down() {
  local down_cmd="${FRESH_BOOTSTRAP_DOWN_CMD:-docker compose down}"
  if [ "${FRESH_BOOTSTRAP_SKIP_DOWN:-0}" = "1" ]; then
    info "Skipping docker compose down (FRESH_BOOTSTRAP_SKIP_DOWN=1)"
    return
  fi
  info "Stopping containers: $down_cmd"
  eval "$down_cmd"
}

docker_up() {
  local up_cmd="${FRESH_BOOTSTRAP_UP_CMD:-docker compose up -d --build}"
  if [ "${FRESH_BOOTSTRAP_SKIP_UP:-0}" = "1" ]; then
    info "Skipping docker compose up (FRESH_BOOTSTRAP_SKIP_UP=1)"
    return
  fi
  info "Rebuilding and starting containers: $up_cmd"
  eval "$up_cmd"
}

main() {
  if ! ensure_dir "$DATA_ROOT"; then
    warn "Expected data directory $DATA_ROOT not found. Adjust FRESH_BOOTSTRAP_DATA_ROOT if needed."
  fi

  docker_down

  purge_workspace_dir "$WORKSPACE_DIR"
  purge_workspace_dir "$PIPELINE_DIR"
  purge_openclaw_config

  info "Fresh bootstrap cleanup complete."

  docker_up

  info "All done."
}

main "$@"
