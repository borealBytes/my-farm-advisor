#!/usr/bin/env bash
set -euo pipefail

THIS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_ROOT="$(cd "${THIS_DIR}/.." && pwd)"

if [[ -n "${R2_SEED_DATA_ROOT:-}" ]]; then
  DATA_ROOT="${R2_SEED_DATA_ROOT}"
elif [[ -d "/data/workspace/data/my-farm-advisor" ]]; then
  DATA_ROOT="/data/workspace/data/my-farm-advisor"
else
  DATA_ROOT="$(cd "${SKILL_ROOT}/../../../../data/my-farm-advisor" 2>/dev/null && pwd || true)"
fi

if [[ -z "${DATA_ROOT}" || ! -d "${DATA_ROOT}" ]]; then
  echo "[install] Unable to locate data root. Set R2_SEED_DATA_ROOT to the data directory." >&2
  exit 1
fi

TARGET_ROOT="${DATA_ROOT}/r2-seed-pipeline"
mkdir -p "${TARGET_ROOT}"

VENV_DIR="${R2_SEED_VENV_DIR:-${TARGET_ROOT}/.venv}"

echo "[install] Data root: ${DATA_ROOT}"
echo "[install] Pipeline root: ${TARGET_ROOT}"
echo "[install] Virtualenv: ${VENV_DIR}"

if [[ ! -x "$(command -v python3)" ]]; then
  echo "[install] python3 not found in PATH" >&2
  exit 1
fi

python3 -m venv --system-site-packages "${VENV_DIR}"
source "${VENV_DIR}/bin/activate"

pip install --upgrade pip
pip install --requirement "${SKILL_ROOT}/requirements.txt"

echo
echo "[install] Virtual environment ready. Activate with:"
echo "  source ${VENV_DIR}/bin/activate"
echo
echo "[install] Afterwards run the pipeline, e.g.:"
echo "  python ${TARGET_ROOT}/src/scripts/run_farm_pipeline.py --grower-slug il-champaign-grower --farm-slug champaign-demo-farm"
