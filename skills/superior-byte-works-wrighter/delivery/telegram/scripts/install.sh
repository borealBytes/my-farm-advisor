#!/usr/bin/env bash
set -euo pipefail

THIS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${THIS_DIR}/.." && pwd)"
DELIVERY_ROOT="$(cd "${ROOT_DIR}/.." && pwd)"
VENV_DIR="${WRIGHTER_DELIVERY_VENV_DIR:-${DELIVERY_ROOT}/.venv}"
CACHE_DIR="${WRIGHTER_DELIVERY_PUPPETEER_CACHE_DIR:-${DELIVERY_ROOT}/.cache/puppeteer}"
PUPPETEER_CONFIG_PATH="${WRIGHTER_DELIVERY_PUPPETEER_CONFIG_PATH:-${DELIVERY_ROOT}/puppeteer.config.json}"

"${DELIVERY_ROOT}/scripts/install-shared-delivery-env.sh"

source "${VENV_DIR}/bin/activate"
pip install -r "${ROOT_DIR}/requirements.txt"

if ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm not found; installing locally via npm"
  npm install -g pnpm
fi

if [ "$(id -u)" = "0" ]; then
  python3 - <<EOF
import json
from pathlib import Path
path = Path(${PUPPETEER_CONFIG_PATH@Q})
config = {"args": ["--no-sandbox", "--disable-setuid-sandbox"]}
path.write_text(json.dumps(config, indent=2) + "\n", encoding="utf-8")
EOF
fi

cd "${ROOT_DIR}"

pnpm install
pnpm run build

echo "Installation complete. Activate the virtualenv with:"
echo "  source ${VENV_DIR}/bin/activate"
