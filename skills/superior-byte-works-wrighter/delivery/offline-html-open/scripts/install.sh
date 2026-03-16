#!/usr/bin/env bash
set -euo pipefail

THIS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${THIS_DIR}/.." && pwd)"
DELIVERY_ROOT="$(cd "${ROOT_DIR}/.." && pwd)"
VENV_DIR="${WRIGHTER_DELIVERY_VENV_DIR:-${DELIVERY_ROOT}/.venv}"

"${DELIVERY_ROOT}/scripts/install-shared-delivery-env.sh"

source "${VENV_DIR}/bin/activate"

if ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm not found; installing via npm"
  npm install -g pnpm
fi

cd "${ROOT_DIR}"

pnpm install
pnpm run build

echo "Offline HTML open delivery built at ${ROOT_DIR}/dist"
