from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

from lib.runtime_paths import RuntimePathError, RuntimePaths, resolve_runtime_paths


def ensure_runtime_environment() -> None:
    try:
        runtime_paths = resolve_runtime_paths()
    except RuntimePathError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(2) from exc

    running_from_runtime = _running_from_runtime_source(runtime_paths)
    if running_from_runtime:
        _ensure_runtime_python(runtime_paths)
        return

    install_needed = not runtime_paths.runtime_source.exists() or not runtime_paths.runtime_python.exists()
    if install_needed:
        _run_installer(runtime_paths)

    runtime_script = _matching_runtime_script(runtime_paths)
    if not runtime_script.exists():
        raise SystemExit(f"ERROR: runtime script missing after install: {runtime_script}")

    python_executable = (
        runtime_paths.runtime_python
        if runtime_paths.runtime_python.exists()
        else Path(sys.executable).resolve(strict=False)
    )
    os.environ["DATA_PIPELINE_RUNTIME_SOURCE_SCRIPT"] = str(runtime_script)
    _preserve_install_script_env()
    print(f"[bootstrap] Re-execing runtime source: {runtime_script}", file=sys.stderr)
    os.execv(str(python_executable), [str(python_executable), str(runtime_script), *sys.argv[1:]])


def _ensure_runtime_python(runtime_paths: RuntimePaths) -> None:
    current_script = _current_invoked_script()
    runtime_python = runtime_paths.runtime_python

    if not runtime_python.exists():
        try:
            _run_installer(runtime_paths)
        except FileNotFoundError as exc:
            if os.environ.get("DATA_PIPELINE_BOOTSTRAP_NO_INSTALL_DEPS") != "1":
                raise
            print(
                f"[bootstrap] Runtime installer unavailable during no-deps smoke: {exc}",
                file=sys.stderr,
            )

    if runtime_python.exists():
        if _is_current_python(runtime_python):
            return
        print(f"[bootstrap] Re-execing runtime Python: {runtime_python}", file=sys.stderr)
        os.execv(str(runtime_python), [str(runtime_python), str(current_script), *sys.argv[1:]])

    if os.environ.get("DATA_PIPELINE_BOOTSTRAP_NO_INSTALL_DEPS") == "1":
        print(
            "[bootstrap] Runtime Python missing; continuing under current Python "
            "because DATA_PIPELINE_BOOTSTRAP_NO_INSTALL_DEPS=1",
            file=sys.stderr,
        )
        return

    raise SystemExit(f"ERROR: runtime Python missing after install: {runtime_python}")


def _running_from_runtime_source(runtime_paths: RuntimePaths) -> bool:
    return _is_relative_to(Path(__file__).resolve(), runtime_paths.runtime_scripts)


def _matching_runtime_script(runtime_paths: RuntimePaths) -> Path:
    invoked = _current_invoked_script()
    scripts_root = Path(__file__).resolve().parent
    try:
        relative_script = invoked.relative_to(scripts_root)
    except ValueError:
        relative_script = Path(invoked.name)
    return runtime_paths.runtime_scripts / relative_script


def _current_invoked_script() -> Path:
    invoked = Path(sys.argv[0]) if sys.argv and sys.argv[0] else Path(__file__)
    invoked = invoked if invoked.is_absolute() else Path.cwd() / invoked
    return invoked.resolve(strict=False)


def _run_installer(runtime_paths: RuntimePaths) -> None:
    install_script = _resolve_install_script()
    os.environ["DATA_PIPELINE_INSTALL_SCRIPT"] = str(install_script)
    command = [
        "bash",
        str(install_script),
        "--data-root",
        str(runtime_paths.data_root),
        "--persist",
        "none",
        "--non-interactive",
        "--force-refresh",
    ]
    if os.environ.get("DATA_PIPELINE_BOOTSTRAP_NO_INSTALL_DEPS") == "1":
        command.append("--no-install-deps")
    subprocess.run(command, check=True, env=os.environ.copy())


def _resolve_install_script() -> Path:
    env_script = os.environ.get("DATA_PIPELINE_INSTALL_SCRIPT")
    if env_script:
        candidate = Path(env_script).expanduser().resolve(strict=False)
        if not candidate.exists():
            raise FileNotFoundError(f"DATA_PIPELINE_INSTALL_SCRIPT does not exist: {candidate}")
        return candidate

    candidate = Path(__file__).resolve().parents[2] / "scripts" / "install.sh"
    if candidate.exists():
        return candidate
    raise FileNotFoundError(f"Unable to locate data-pipeline install.sh at {candidate}")


def _preserve_install_script_env() -> None:
    if os.environ.get("DATA_PIPELINE_INSTALL_SCRIPT"):
        return
    install_script = _resolve_install_script()
    os.environ["DATA_PIPELINE_INSTALL_SCRIPT"] = str(install_script)


def _is_current_python(runtime_python: Path) -> bool:
    runtime_python = runtime_python.absolute()
    current_executable = Path(sys.executable).absolute()
    if current_executable == runtime_python:
        return True
    return Path(sys.prefix).resolve(strict=False) == runtime_python.parent.parent.resolve(strict=False)


def _is_relative_to(path: Path, parent: Path) -> bool:
    try:
        path.relative_to(parent)
        return True
    except ValueError:
        return False
