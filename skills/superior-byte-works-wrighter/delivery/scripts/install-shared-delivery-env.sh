#!/usr/bin/env bash
set -euo pipefail

THIS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DELIVERY_ROOT="$(cd "${THIS_DIR}/.." && pwd)"
VENV_DIR="${WRIGHTER_DELIVERY_VENV_DIR:-${DELIVERY_ROOT}/.venv}"
CACHE_DIR="${WRIGHTER_DELIVERY_PUPPETEER_CACHE_DIR:-${DELIVERY_ROOT}/.cache/puppeteer}"
CONFIG_PATH="${WRIGHTER_DELIVERY_PUPPETEER_CONFIG_PATH:-${DELIVERY_ROOT}/puppeteer.config.json}"

if [ ! -d "${VENV_DIR}" ]; then
  python3 -m venv "${VENV_DIR}"
fi

source "${VENV_DIR}/bin/activate"
pip install --upgrade pip

if ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm not found; installing locally via npm"
  npm install -g pnpm
fi

mkdir -p "${CACHE_DIR}"
PUPPETEER_CACHE_DIR="${CACHE_DIR}" pnpm dlx puppeteer browsers install chrome

CHROME_PATH="$(find "${CACHE_DIR}" -path '*/chrome-linux64/chrome' -type f | sort | tail -n 1 || true)"

python3 - <<EOF
import json
from pathlib import Path

path = Path(${CONFIG_PATH@Q})
chrome_path = ${CHROME_PATH@Q}
config = {
    "args": ["--no-sandbox", "--disable-setuid-sandbox"] if ${EUID@Q} == "0" else [],
}
if chrome_path:
    config["executablePath"] = chrome_path
path.write_text(json.dumps(config, indent=2) + "\n", encoding="utf-8")
EOF

echo "Shared Wrighter delivery environment ready"
echo "  VENV: ${VENV_DIR}"
echo "  CACHE: ${CACHE_DIR}"
echo "  CONFIG: ${CONFIG_PATH}"
