#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="/tmp/my-farm-advisor-start.log"
PID_FILE="/tmp/my-farm-advisor-dev.pid"
CONTAINER_NAME_PREFIX="workerd-my-farm-advisor-sandbox-Sandbox-"
HEALTH_URL="http://127.0.0.1:8787/api/status"

usage() {
  printf "Usage: %s [--start|--stop|--restart|--status]\n" "$(basename "$0")"
}

is_pid_running() {
  local pid="$1"
  [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null
}

stop_local_server() {
  if [[ -f "$PID_FILE" ]]; then
    local pid
    pid="$(cat "$PID_FILE" 2>/dev/null || true)"
    if is_pid_running "$pid"; then
      kill "$pid" 2>/dev/null || true
      sleep 1
      if is_pid_running "$pid"; then
        kill -9 "$pid" 2>/dev/null || true
      fi
    fi
    rm -f "$PID_FILE"
  fi

  local port_pids
  port_pids="$(lsof -ti tcp:8787 2>/dev/null || true)"
  if [[ -n "$port_pids" ]]; then
    for pid in $port_pids; do
      kill "$pid" 2>/dev/null || true
    done
    sleep 1
    port_pids="$(lsof -ti tcp:8787 2>/dev/null || true)"
    if [[ -n "$port_pids" ]]; then
      for pid in $port_pids; do
        kill -9 "$pid" 2>/dev/null || true
      done
    fi
  fi
}

cleanup_local_containers() {
  if ! command -v docker >/dev/null 2>&1; then
    return
  fi

  local ids
  ids="$(docker ps -aq --filter "name=${CONTAINER_NAME_PREFIX}" 2>/dev/null || true)"
  if [[ -z "$ids" ]]; then
    return
  fi

  docker stop $ids >/dev/null 2>&1 || true
  docker rm $ids >/dev/null 2>&1 || true
}

wait_for_health() {
  local attempts=45
  local i
  for ((i = 1; i <= attempts; i++)); do
    local code
    code="$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL" || true)"
    if [[ "$code" != "000" ]]; then
      printf "Local dev ready on http://127.0.0.1:8787 (status %s)\n" "$code"
      return 0
    fi
    sleep 2
  done

  printf "Timed out waiting for local dev server. Check logs: %s\n" "$LOG_FILE"
  return 1
}

start_local_server() {
  stop_local_server
  cleanup_local_containers

  (
    cd "$ROOT_DIR"
    npm run build >/dev/null
    npm run start >"$LOG_FILE" 2>&1 &
    echo $! >"$PID_FILE"
  )

  wait_for_health
}

status_local_server() {
  local pid=""
  if [[ -f "$PID_FILE" ]]; then
    pid="$(cat "$PID_FILE" 2>/dev/null || true)"
  fi

  if is_pid_running "$pid"; then
    printf "Server PID: %s (running)\n" "$pid"
  else
    printf "Server PID: not running\n"
  fi

  local code
  code="$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL" || true)"
  if [[ "$code" == "000" ]]; then
    printf "Health: unreachable\n"
  else
    printf "Health: HTTP %s\n" "$code"
  fi

  if command -v docker >/dev/null 2>&1; then
    local container_count
    container_count="$(docker ps -a --filter "name=${CONTAINER_NAME_PREFIX}" --format '{{.ID}}' | wc -l | tr -d ' ')"
    printf "Project sandbox containers: %s\n" "$container_count"
  fi
}

if [[ $# -ne 1 ]]; then
  usage
  exit 1
fi

case "$1" in
  --start)
    start_local_server
    ;;
  --stop)
    stop_local_server
    cleanup_local_containers
    printf "Local dev stopped and project containers cleaned.\n"
    ;;
  --restart)
    stop_local_server
    cleanup_local_containers
    start_local_server
    ;;
  --status)
    status_local_server
    ;;
  *)
    usage
    exit 1
    ;;
esac
