#!/usr/bin/env bash
set -euo pipefail

THIS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${THIS_DIR}/.." && pwd)"
VENV_DIR="${ROOT_DIR}/.venv"

if [ ! -d "${VENV_DIR}" ]; then
  python3 -m venv "${VENV_DIR}"
fi

source "${VENV_DIR}/bin/activate"

pip install --upgrade pip

if ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm not found; installing via npm"
  npm install -g pnpm
fi

cd "${ROOT_DIR}"

pnpm install
pnpm run build

echo "Offline HTML open delivery built at ${ROOT_DIR}/dist"
