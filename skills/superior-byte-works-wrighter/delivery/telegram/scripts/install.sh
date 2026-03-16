#!/usr/bin/env bash
set -euo pipefail

THIS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${THIS_DIR}/.." && pwd)"
VENV_DIR="${ROOT_DIR}/.venv"
CACHE_DIR="${ROOT_DIR}/.cache/puppeteer"
PUPPETEER_CONFIG_PATH="${ROOT_DIR}/puppeteer.config.cjs"

if [ ! -d "${VENV_DIR}" ]; then
  python3 -m venv "${VENV_DIR}"
fi

source "${VENV_DIR}/bin/activate"

pip install --upgrade pip
pip install -r "${ROOT_DIR}/requirements.txt"

if ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm not found; installing locally via npm"
  npm install -g pnpm
fi

cd "${ROOT_DIR}"

pnpm install
pnpm run build

mkdir -p "${CACHE_DIR}"
PUPPETEER_CACHE_DIR="${CACHE_DIR}" pnpm dlx puppeteer browsers install chrome

cat > "${PUPPETEER_CONFIG_PATH}" <<'EOF'
const isRoot = typeof process.getuid === "function" && process.getuid() === 0;

module.exports = {
  launch: {
    headless: true,
    args: isRoot ? ["--no-sandbox", "--disable-setuid-sandbox"] : [],
  },
};
EOF

echo "Installation complete. Activate the virtualenv with:"
echo "  source ${VENV_DIR}/bin/activate"
