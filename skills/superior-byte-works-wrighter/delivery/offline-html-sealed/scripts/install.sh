#!/usr/bin/env bash
set -euo pipefail

THIS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${THIS_DIR}/.." && pwd)"
DELIVERY_ROOT="$(cd "${ROOT_DIR}/.." && pwd)"

OPEN_INSTALL="${ROOT_DIR}/../offline-html-open/scripts/install.sh"
if [ -f "${OPEN_INSTALL}" ]; then
  bash "${OPEN_INSTALL}"
fi

VENV_DIR="${WRIGHTER_DELIVERY_VENV_DIR:-${DELIVERY_ROOT}/.venv}"

source "${VENV_DIR}/bin/activate"

if ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm not found; installing via npm"
  npm install -g pnpm
fi

cd "${ROOT_DIR}"

pnpm install
pnpm run build

echo "Offline HTML sealed delivery built at ${ROOT_DIR}/dist"
