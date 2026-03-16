from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path


def ensure_runtime_environment() -> None:
    target_root = _resolve_target_root()
    venv_dir = Path(os.environ.get("R2_SEED_VENV_DIR", str(target_root / ".venv")))
    venv_python = venv_dir / "bin" / "python"
    if _is_current_python(venv_python):
        return
    if not venv_python.exists():
        install_script = _resolve_install_script()
        env = os.environ.copy()
        env.setdefault("R2_SEED_DATA_ROOT", str(target_root.parent))
        subprocess.run(["bash", str(install_script)], check=True, env=env)
    os.execv(str(venv_python), [str(venv_python), *sys.argv])


def _resolve_target_root() -> Path:
    env_root = os.environ.get("R2_SEED_DATA_ROOT")
    if env_root:
        return Path(env_root).resolve() / "r2-seed-pipeline"
    workspace_root = Path("/data/workspace/data/my-farm-advisor")
    if workspace_root.exists():
        return workspace_root / "r2-seed-pipeline"
    repo_data_root = Path(__file__).resolve().parents[4] / "data" / "my-farm-advisor"
    return repo_data_root / "r2-seed-pipeline"


def _resolve_install_script() -> Path:
    env_script = os.environ.get("R2_SEED_INSTALL_SCRIPT")
    if env_script:
        candidate = Path(env_script).resolve()
        if candidate.exists():
            return candidate
    candidates = [
        Path("/data/workspace/skills/my-farm-advisor/r2-seed-pipeline/scripts/install.sh"),
        Path(__file__).resolve().parents[2] / "scripts" / "install.sh",
        Path.cwd() / "skills" / "my-farm-advisor" / "r2-seed-pipeline" / "scripts" / "install.sh",
    ]
    for candidate in candidates:
        if candidate.exists():
            return candidate
    raise FileNotFoundError("Unable to locate r2-seed-pipeline install.sh")


def _is_current_python(venv_python: Path) -> bool:
    try:
        current_executable = Path(sys.executable)
        if current_executable == venv_python:
            return True
        return sys.prefix == str(venv_python.parent.parent)
    except FileNotFoundError:
        return False
