#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

TARGET_DIR="$REPO_ROOT"
CONFIG_FILE="$SCRIPT_DIR/config.toml"
REPORT_FILE="$REPO_ROOT/link-check-report.md"
JSON_REPORT_FILE="$REPO_ROOT/link-check-report.json"
RAW_FILE="$REPO_ROOT/.sisyphus/memory/link-raw.json"
MEMORY_FILE="$REPO_ROOT/.sisyphus/memory/link-overrides.json"
INTERACTIVE=1
VERIFIED_BY="user"
NOTES="Site blocks bots but works in browser"

usage() {
  cat <<'EOF'
Usage: link-checker.sh [options]

Options:
  --target <dir>          Directory to scan (default: repo root)
  --config <file>         Lychee TOML config file
  --report <file>         Markdown report output path
  --json-report <file>    JSON report output path
  --memory <file>         Override memory JSON path
  --verified-by <name>    Name for manual override metadata
  --notes <text>          Notes for manual override entries
  --non-interactive       Disable confirmation prompts
  -h, --help              Show this help
EOF
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --target)
      TARGET_DIR="$2"
      shift 2
      ;;
    --config)
      CONFIG_FILE="$2"
      shift 2
      ;;
    --report)
      REPORT_FILE="$2"
      shift 2
      ;;
    --json-report)
      JSON_REPORT_FILE="$2"
      shift 2
      ;;
    --memory)
      MEMORY_FILE="$2"
      shift 2
      ;;
    --verified-by)
      VERIFIED_BY="$2"
      shift 2
      ;;
    --notes)
      NOTES="$2"
      shift 2
      ;;
    --non-interactive)
      INTERACTIVE=0
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      exit 2
      ;;
  esac
done

if ! command -v lychee >/dev/null 2>&1; then
  echo "Error: lychee is not installed. Install with: cargo install lychee" >&2
  exit 2
fi

if ! command -v python3 >/dev/null 2>&1; then
  echo "Error: python3 is required." >&2
  exit 2
fi

mkdir -p "$(dirname "$MEMORY_FILE")"
mkdir -p "$(dirname "$REPORT_FILE")"
mkdir -p "$(dirname "$JSON_REPORT_FILE")"
mkdir -p "$(dirname "$RAW_FILE")"

if [ ! -f "$MEMORY_FILE" ]; then
  cat > "$MEMORY_FILE" <<'EOF'
{
  "link-overrides": {}
}
EOF
fi

TMP_RATE_LIMITED="$(mktemp)"
TMP_BROKEN="$(mktemp)"
trap 'rm -f "$TMP_RATE_LIMITED" "$TMP_BROKEN"' EXIT

set +e
(cd "$TARGET_DIR" && lychee --config "$CONFIG_FILE" --no-progress --verbose --format json --output "$RAW_FILE" '**/*.md')
LYCHEE_EXIT=$?
set -e

python3 - "$RAW_FILE" "$MEMORY_FILE" "$TMP_RATE_LIMITED" "$TMP_BROKEN" <<'PY'
import json
import pathlib
import re
import sys

raw_path = pathlib.Path(sys.argv[1])
memory_path = pathlib.Path(sys.argv[2])
rate_path = pathlib.Path(sys.argv[3])
broken_path = pathlib.Path(sys.argv[4])

def load_json(path, fallback):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return fallback

raw = load_json(raw_path, [])
memory = load_json(memory_path, {"link-overrides": {}})
overrides = memory.get("link-overrides", {}) if isinstance(memory, dict) else {}

items = []
if isinstance(raw, list):
    items = raw
elif isinstance(raw, dict):
    for key in ("links", "results", "items"):
        if isinstance(raw.get(key), list):
            items = raw[key]
            break

def extract_url(item):
    for key in ("url", "uri", "link", "target"):
        val = item.get(key)
        if isinstance(val, str) and val.strip():
            return val.strip()
    blob = json.dumps(item, ensure_ascii=False)
    m = re.search(r"https?://[^\"\s>]+", blob)
    return m.group(0) if m else ""

def extract_source(item):
    for key in ("input", "source", "file"):
        val = item.get(key)
        if isinstance(val, str) and val.strip():
            return val.strip()
    return ""

rate_limited = []
broken = []

for item in items:
    if not isinstance(item, dict):
        continue
    url = extract_url(item)
    if not url:
        continue
    source = extract_source(item)
    blob = json.dumps(item, ensure_ascii=False).lower()
    is_failure = any(token in blob for token in [
        "error", "fail", "timeout", "not found", "unreachable", "forbidden", "dns"
    ]) or bool(re.search(r"status\s*code[^0-9]*(4|5)\d{2}", blob))
    is_403_429 = ("403" in blob) or ("429" in blob)
    override = overrides.get(url, {}) if isinstance(overrides, dict) else {}
    manually_verified = isinstance(override, dict) and override.get("status") == "manually_verified"

    if not is_failure:
        continue
    if manually_verified:
        continue
    if is_403_429:
        rate_limited.append({"url": url, "source": source})
    else:
        broken.append({"url": url, "source": source})

rate_path.write_text("\n".join(sorted({f"{x['url']}\t{x['source']}" for x in rate_limited})), encoding="utf-8")
broken_path.write_text("\n".join(sorted({f"{x['url']}\t{x['source']}" for x in broken})), encoding="utf-8")
PY

if [ "$INTERACTIVE" -eq 1 ] && [ -s "$TMP_RATE_LIMITED" ]; then
  VERIFIED_URLS=()
  while IFS=$'\t' read -r url source; do
    [ -n "$url" ] || continue
    if [ -n "$source" ]; then
      echo "Link $url returned 403/429 in $source. Site may block bots."
    else
      echo "Link $url returned 403/429. Site may block bots."
    fi
    printf "Please verify in browser: Does this link work? [y/n] "
    read -r answer
    case "${answer,,}" in
      y|yes)
        VERIFIED_URLS+=("$url")
        ;;
      *)
        printf '%s\t%s\n' "$url" "$source" >> "$TMP_BROKEN"
        ;;
    esac
  done < "$TMP_RATE_LIMITED"

  if [ "${#VERIFIED_URLS[@]}" -gt 0 ]; then
    python3 - "$MEMORY_FILE" "$VERIFIED_BY" "$NOTES" "${VERIFIED_URLS[@]}" <<'PY'
import json
import pathlib
import sys
from datetime import date

memory_path = pathlib.Path(sys.argv[1])
verified_by = sys.argv[2]
notes = sys.argv[3]
urls = sys.argv[4:]

try:
    data = json.loads(memory_path.read_text(encoding="utf-8"))
except Exception:
    data = {"link-overrides": {}}

if not isinstance(data, dict):
    data = {"link-overrides": {}}
if "link-overrides" not in data or not isinstance(data["link-overrides"], dict):
    data["link-overrides"] = {}

today = date.today().isoformat()
for url in urls:
    data["link-overrides"][url] = {
        "status": "manually_verified",
        "verified_by": verified_by,
        "date": today,
        "notes": notes,
    }

memory_path.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
PY
  fi
fi

python3 - "$RAW_FILE" "$MEMORY_FILE" "$REPORT_FILE" "$JSON_REPORT_FILE" "$TMP_RATE_LIMITED" "$TMP_BROKEN" <<'PY'
import json
import pathlib
import re
import sys

raw_path = pathlib.Path(sys.argv[1])
memory_path = pathlib.Path(sys.argv[2])
report_path = pathlib.Path(sys.argv[3])
json_report_path = pathlib.Path(sys.argv[4])
rate_path = pathlib.Path(sys.argv[5])
broken_path = pathlib.Path(sys.argv[6])

def load_json(path, fallback):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return fallback

raw = load_json(raw_path, [])
memory = load_json(memory_path, {"link-overrides": {}})
overrides = memory.get("link-overrides", {}) if isinstance(memory, dict) else {}

items = []
if isinstance(raw, list):
    items = raw
elif isinstance(raw, dict):
    for key in ("links", "results", "items"):
        if isinstance(raw.get(key), list):
            items = raw[key]
            break

def extract_url(item):
    for key in ("url", "uri", "link", "target"):
        val = item.get(key)
        if isinstance(val, str) and val.strip():
            return val.strip()
    blob = json.dumps(item, ensure_ascii=False)
    m = re.search(r"https?://[^\"\s>]+", blob)
    return m.group(0) if m else ""

def extract_source(item):
    for key in ("input", "source", "file"):
        val = item.get(key)
        if isinstance(val, str) and val.strip():
            return val.strip()
    return ""

rows = []
seen = set()
for item in items:
    if not isinstance(item, dict):
        continue
    url = extract_url(item)
    if not url:
        continue
    source = extract_source(item)
    blob = json.dumps(item, ensure_ascii=False).lower()
    is_failure = any(token in blob for token in [
        "error", "fail", "timeout", "not found", "unreachable", "forbidden", "dns"
    ]) or bool(re.search(r"status\s*code[^0-9]*(4|5)\d{2}", blob))
    is_rate = ("403" in blob) or ("429" in blob)
    override = overrides.get(url, {}) if isinstance(overrides, dict) else {}
    manually_verified = isinstance(override, dict) and override.get("status") == "manually_verified"

    if not is_failure:
        status = "ok"
    elif manually_verified:
        status = "manually_verified"
    elif is_rate:
        status = "rate_limited"
    else:
        status = "broken"

    key = (url, source, status)
    if key in seen:
        continue
    seen.add(key)
    rows.append({"url": url, "source": source, "status": status})

broken_from_prompt = []
if broken_path.exists() and broken_path.read_text(encoding="utf-8").strip():
    for line in broken_path.read_text(encoding="utf-8").splitlines():
        parts = line.split("\t", 1)
        broken_from_prompt.append({"url": parts[0], "source": parts[1] if len(parts) > 1 else ""})

existing_broken = [r for r in rows if r["status"] == "broken"]
for row in broken_from_prompt:
    if row not in existing_broken:
        existing_broken.append({"url": row["url"], "source": row.get("source", ""), "status": "broken"})

manual = [r for r in rows if r["status"] == "manually_verified"]
rate = [r for r in rows if r["status"] == "rate_limited"]
ok = [r for r in rows if r["status"] == "ok"]

final = {
    "summary": {
        "ok": len(ok),
        "manually_verified": len(manual),
        "rate_limited": len(rate),
        "broken": len(existing_broken),
        "total": len(rows),
    },
    "broken": existing_broken,
    "rate_limited": rate,
    "manually_verified": manual,
}
json_report_path.write_text(json.dumps(final, indent=2) + "\n", encoding="utf-8")

lines = []
lines.append("# Link Check Report")
lines.append("")
lines.append("## Summary")
lines.append("")
lines.append(f"- Total links scanned: **{final['summary']['total']}**")
lines.append(f"- OK: **{final['summary']['ok']}**")
lines.append(f"- Manually verified: **{final['summary']['manually_verified']}**")
lines.append(f"- Rate-limited (403/429): **{final['summary']['rate_limited']}**")
lines.append(f"- Broken: **{final['summary']['broken']}**")
lines.append("")

if existing_broken:
    lines.append("## Broken Links")
    lines.append("")
    lines.append("| Link | Source |")
    lines.append("|------|--------|")
    for row in existing_broken:
        src = row.get("source") or "(unknown)"
        lines.append(f"| {row['url']} | {src} |")
    lines.append("")

if rate:
    lines.append("## Rate-Limited Links (403/429)")
    lines.append("")
    lines.append("| Link | Source |")
    lines.append("|------|--------|")
    for row in rate:
        src = row.get("source") or "(unknown)"
        lines.append(f"| {row['url']} | {src} |")
    lines.append("")

if manual:
    lines.append("## Manually Verified Overrides")
    lines.append("")
    lines.append("| Link | Source |")
    lines.append("|------|--------|")
    for row in manual:
        src = row.get("source") or "(unknown)"
        lines.append(f"| {row['url']} | {src} |")
    lines.append("")

if not existing_broken and not rate:
    lines.append("## Result")
    lines.append("")
    lines.append("All checked links are valid or manually verified.")

report_path.write_text("\n".join(lines) + "\n", encoding="utf-8")

sys.exit(1 if final["summary"]["broken"] > 0 else 0)
PY

echo "Markdown report: $REPORT_FILE"
echo "JSON report: $JSON_REPORT_FILE"
if [ "$LYCHEE_EXIT" -ne 0 ]; then
  echo "Lychee reported issues; see report for categorized results."
fi
