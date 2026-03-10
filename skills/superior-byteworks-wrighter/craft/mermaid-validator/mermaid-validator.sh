#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

TARGET_DIR="$REPO_ROOT"
CONFIG_FILE="$SCRIPT_DIR/config.toml"
REPORT_FILE="$REPO_ROOT/mermaid-validation-report.md"
JSON_REPORT_FILE="$REPO_ROOT/mermaid-validation-report.json"
MEMORY_FILE="$REPO_ROOT/.sisyphus/memory/mermaid-overrides.json"
INTERACTIVE=1
VERIFIED_BY="user"
NOTES="Known valid diagram with rendering quirks"

usage() {
  cat <<'EOF'
Usage: mermaid-validator.sh [options]

Options:
  --target <dir>      Directory to scan (default: repo root)
  --config <file>     Config file path
  --report <file>     Markdown report output path
  --json-report <file> JSON report output path
  --memory <file>     Override memory JSON path
  --verified-by <name> Name for manual override metadata
  --notes <text>      Notes for manual override entries
  --non-interactive   Disable confirmation prompts
  --fix               Auto-fix common issues
  -h, --help          Show this help
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
    --fix)
      AUTO_FIX=1
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

if ! command -v python3 >/dev/null 2>&1; then
  echo "Error: python3 is required." >&2
  exit 2
fi

mkdir -p "$(dirname "$MEMORY_FILE")"
mkdir -p "$(dirname "$REPORT_FILE")"
mkdir -p "$(dirname "$JSON_REPORT_FILE")"

if [ ! -f "$MEMORY_FILE" ]; then
  cat > "$MEMORY_FILE" <<'EOF'
{
  "mermaid-overrides": {}
}
EOF
fi

python3 - "$TARGET_DIR" "$MEMORY_FILE" "$REPORT_FILE" "$JSON_REPORT_FILE" <<'PY'
import json
import pathlib
import re
import sys
from datetime import datetime

target_dir = pathlib.Path(sys.argv[1])
memory_path = pathlib.Path(sys.argv[2])
report_path = pathlib.Path(sys.argv[3])
json_report_path = pathlib.Path(sys.argv[4])

def load_json(path, fallback):
  try:
    return json.loads(path.read_text(encoding="utf-8"))
  except Exception:
    return fallback

memory = load_json(memory_path, {"mermaid-overrides": {}})
overrides = memory.get("mermaid-overrides", {}) if isinstance(memory, dict) else {}

# Valid Mermaid diagram types (as of Mermaid v10)
VALID_DIAGRAM_TYPES = {
  'flowchart', 'graph', 'sequenceDiagram', 'classDiagram', 'stateDiagram',
  'stateDiagram-v2', 'erDiagram', 'journey', 'gantt', 'pie', 'requirementDiagram',
  'gitgraph', 'mindmap', 'timeline', 'quadrantChart', 'xychart', 'xychart-beta',
  'block', 'block-beta', 'sankey', 'C4Context', 'C4Container', 'C4Component',
  'C4Dynamic', 'C4Deployment', 'architecture', 'architecture-beta'
}

# Valid directions for flowchart/graph
VALID_DIRECTIONS = {'TB', 'TD', 'BT', 'RL', 'LR'}

# Common syntax patterns
PATTERNS = {
  'acc_title': re.compile(r'^\s*accTitle\s*:', re.MULTILINE),
  'acc_descr': re.compile(r'^\s*accDescr\s*:', re.MULTILINE),
  'subgraph': re.compile(r'^\s*subgraph\s+', re.MULTILINE),
  'end': re.compile(r'^\s*end\s*$', re.MULTILINE),
  'arrow': re.compile(r'[-=]+[>\.]\|?'),  # Basic arrow check
  'node_def': re.compile(r'\[\s*[^\]]+\]'),  # Node definitions
  'class_def': re.compile(r'^\s*classDef\s+', re.MULTILINE),
  'click': re.compile(r'^\s*click\s+', re.MULTILINE),
  'style': re.compile(r'^\s*style\s+', re.MULTILINE),
}

class MermaidValidator:
  def __init__(self):
    self.issues = []
    self.valid = []
    self.warnings = []
    
  def validate_diagram(self, content: str, source_file: str, line_num: int) -> dict:
    """Validate a single mermaid diagram."""
    lines = content.strip().split('\n')
    if not lines:
      return {'valid': False, 'error': 'Empty diagram', 'source': source_file, 'line': line_num}
    
    first_line = lines[0].strip()
    result = {
      'source': source_file,
      'line': line_num,
      'type': 'unknown',
      'valid': True,
      'errors': [],
      'warnings': [],
      'has_acc_title': False,
      'has_acc_descr': False,
      'line_count': len(lines)
    }
    
    # Extract diagram type
    parts = first_line.split()
    if not parts:
      result['errors'].append('Empty first line')
      result['valid'] = False
      return result
    
    diagram_type = parts[0]
    result['type'] = diagram_type
    
    # Check if it's a valid diagram type
    if diagram_type not in VALID_DIAGRAM_TYPES:
      # Check for common typos
      if diagram_type == 'flowhchart':
        result['errors'].append(f"Typo: '{diagram_type}' should be 'flowchart'")
        result['valid'] = False
      elif diagram_type == 'seqenceDiagram':
        result['errors'].append(f"Typo: '{diagram_type}' should be 'sequenceDiagram'")
        result['valid'] = False
      elif diagram_type == 'gant':
        result['errors'].append(f"Typo: '{diagram_type}' should be 'gantt'")
        result['valid'] = False
      elif diagram_type == 'architecture-beta':
        result['errors'].append(f"'architecture-beta' is not valid Mermaid syntax. Use 'flowchart' instead")
        result['valid'] = False
      elif diagram_type == 'radar-beta':
        result['errors'].append(f"'radar-beta' is not valid Mermaid syntax. Use 'pie' or other chart types")
        result['valid'] = False
      else:
        result['warnings'].append(f"Unknown diagram type: '{diagram_type}' (may be experimental)")
    
    # Check for accTitle/accDescr on same line as diagram type (bad)
    if 'accTitle:' in first_line or 'accDescr:' in first_line:
      result['errors'].append("accTitle/accDescr must be on separate lines after diagram type declaration")
      result['valid'] = False
    
    # Check flowchart/graph direction
    if diagram_type in ('flowchart', 'graph') and len(parts) > 1:
      direction = parts[1].upper()
      if direction not in VALID_DIRECTIONS:
        result['warnings'].append(f"Unusual direction: '{direction}'")
    
    # Check for accessibility attributes
    if PATTERNS['acc_title'].search(content):
      result['has_acc_title'] = True
    if PATTERNS['acc_descr'].search(content):
      result['has_acc_descr'] = True
    
    if not result['has_acc_title']:
      result['warnings'].append("Missing accTitle (accessibility recommendation)")
    if not result['has_acc_descr']:
      result['warnings'].append("Missing accDescr (accessibility recommendation)")
    
    # Type-specific validation
    if diagram_type in ('flowchart', 'graph'):
      self._validate_flowchart(content, result)
    elif diagram_type == 'sequenceDiagram':
      self._validate_sequence(content, result)
    elif diagram_type == 'gantt':
      self._validate_gantt(content, result)
    elif diagram_type == 'pie':
      self._validate_pie(content, result)
    
    return result
  
  def _validate_flowchart(self, content: str, result: dict):
    """Additional flowchart-specific validation."""
    # Check for balanced subgraphs
    subgraphs = len(PATTERNS['subgraph'].findall(content))
    ends = len([m for m in PATTERNS['end'].finditer(content)])
    
    if subgraphs > 0 and ends < subgraphs:
      result['errors'].append(f"Unclosed subgraph(s): {subgraphs} subgraphs, {ends} 'end' statements")
      result['valid'] = False
    
    # Check for node definitions
    nodes = PATTERNS['node_def'].findall(content)
    if len(nodes) < 2 and subgraphs == 0:
      result['warnings'].append("Diagram has very few nodes (< 2)")
  
  def _validate_sequence(self, content: str, result: dict):
    """Additional sequence diagram validation."""
    # Check for participant definitions
    participant_pattern = re.compile(r'^\s*participant\s+', re.MULTILINE)
    participants = len(participant_pattern.findall(content))
    
    if participants == 0:
      result['warnings'].append("No explicit participant definitions (optional but recommended)")
    
    # Check for message arrows
    arrow_pattern = re.compile(r'->>')
    if not arrow_pattern.search(content):
      result['warnings'].append("No message arrows found (>>)")
  
  def _validate_gantt(self, content: str, result: dict):
    """Additional gantt chart validation."""
    # Check for date format
    date_pattern = re.compile(r'\d{4}-\d{2}-\d{2}')
    if not date_pattern.search(content):
      result['warnings'].append("No ISO dates (YYYY-MM-DD) found")
  
  def _validate_pie(self, content: str, result: dict):
    """Additional pie chart validation."""
    # Check for data
    data_pattern = re.compile(r':\s*\d+')
    if not data_pattern.search(content):
      result['warnings'].append("No data values found (expected ': number' format)")

validator = MermaidValidator()

# Find all mermaid diagrams
results = []
stats = {
  'total_files': 0,
  'total_diagrams': 0,
  'by_type': {},
  'valid': 0,
  'invalid': 0,
  'warnings': 0
}

for md_file in target_dir.rglob('*.md'):
  stats['total_files'] += 1
  content = md_file.read_text(encoding='utf-8')
  
  # Find all mermaid code blocks
  mermaid_pattern = re.compile(r'```mermaid\n(.*?)```', re.DOTALL)
  matches = list(mermaid_pattern.finditer(content))
  
  for match in matches:
    stats['total_diagrams'] += 1
    diagram_content = match.group(1)
    
    # Calculate line number
    line_num = content[:match.start()].count('\n') + 1
    
    result = validator.validate_diagram(diagram_content, str(md_file), line_num)
    results.append(result)
    
    # Update stats
    diagram_type = result['type']
    stats['by_type'][diagram_type] = stats['by_type'].get(diagram_type, 0) + 1
    
    if result['valid'] and not result['errors']:
      stats['valid'] += 1
    if result['errors']:
      stats['invalid'] += 1
    if result['warnings']:
      stats['warnings'] += 1

# Build report
default_dict = lambda: {"count": 0, "items": []}
report = {
  "summary": {
    "total_files_scanned": stats['total_files'],
    "total_diagrams_found": stats['total_diagrams'],
    "valid": stats['valid'],
    "invalid": stats['invalid'],
    "with_warnings": stats['warnings'],
    "by_type": stats['by_type']
  },
  "valid_diagrams": [],
  "errors": [],
  "warnings": []
}

for result in results:
  if result['valid'] and not result['errors']:
    report['valid_diagrams'].append({
      "file": result['source'],
      "line": result['line'],
      "type": result['type'],
      "lines": result['line_count']
    })
  
  for error in result.get('errors', []):
    report['errors'].append({
      "file": result['source'],
      "line": result['line'],
      "type": result['type'],
      "error": error
    })
  
  for warning in result.get('warnings', []):
    report['warnings'].append({
      "file": result['source'],
      "line": result['line'],
      "type": result['type'],
      "warning": warning
    })

json_report_path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")

# Generate markdown report
lines = []
lines.append("# Mermaid Validation Report")
lines.append("")
lines.append(f"Generated: {datetime.now().isoformat()}")
lines.append("")
lines.append("## Summary")
lines.append("")
lines.append(f"- Total files scanned: **{stats['total_files']}**")
lines.append(f"- Total diagrams found: **{stats['total_diagrams']}**")
lines.append(f"- Valid diagrams: **{stats['valid']}** ✅")
lines.append(f"- Diagrams with errors: **{stats['invalid']}** ❌")
lines.append(f"- Diagrams with warnings: **{stats['warnings']}** ⚠️")
lines.append("")

# By type
lines.append("### Diagram Types")
lines.append("")
lines.append("| Type | Count |")
lines.append("|------|-------|")
for dtype, count in sorted(stats['by_type'].items(), key=lambda x: -x[1]):
  lines.append(f"| {dtype} | {count} |")
lines.append("")

# Errors
if report['errors']:
  lines.append("## Errors ❌")
  lines.append("")
  lines.append("| File | Line | Type | Error |")
  lines.append("|------|------|------|-------|")
  for err in report['errors']:
    file_short = pathlib.Path(err['file']).relative_to(target_dir) if str(err['file']).startswith(str(target_dir)) else err['file']
    lines.append(f"| {file_short} | {err['line']} | `{err['type']}` | {err['error']} |")
  lines.append("")
else:
  lines.append("## Errors ❌")
  lines.append("")
  lines.append("No errors found! 🎉")
  lines.append("")

# Warnings
if report['warnings']:
  lines.append("## Warnings ⚠️")
  lines.append("")
  lines.append("| File | Line | Type | Warning |")
  lines.append("|------|------|------|---------|")
  for warn in report['warnings'][:100]:  # Limit to first 100
    file_short = pathlib.Path(warn['file']).relative_to(target_dir) if str(warn['file']).startswith(str(target_dir)) else warn['file']
    lines.append(f"| {file_short} | {warn['line']} | `{warn['type']}` | {warn['warning']} |")
  if len(report['warnings']) > 100:
    lines.append(f"| ... | ... | ... | *{len(report['warnings']) - 100} more warnings* |")
  lines.append("")

# Valid diagrams (top 20)
lines.append("## Sample Valid Diagrams ✅")
lines.append("")
lines.append("| File | Line | Type | Lines |")
lines.append("|------|------|------|-------|")
for vd in report['valid_diagrams'][:20]:
  file_short = pathlib.Path(vd['file']).relative_to(target_dir) if str(vd['file']).startswith(str(target_dir)) else vd['file']
  lines.append(f"| {file_short} | {vd['line']} | `{vd['type']}` | {vd['lines']} |")
lines.append("")

# Recommendations
lines.append("## Recommendations")
lines.append("")
if report['errors']:
  lines.append("1. **Fix errors** before committing")
  lines.append("2. Review warnings for accessibility improvements")
else:
  lines.append("1. All diagrams are syntactically valid!")
  lines.append("2. Consider adding accTitle/accDescr to diagrams missing them (accessibility)")
lines.append("")
lines.append("### Common Fixes")
lines.append("")
lines.append("```bash")
lines.append("# Replace invalid diagram types")
lines.append("sed -i 's/architecture-beta/flowchart LR/g' file.md")
lines.append("sed -i 's/radar-beta/pie/g' file.md")
lines.append("")
lines.append("# Move accTitle/accDescr to separate lines")
lines.append("# BEFORE: flowchart TB accTitle: Title")
lines.append("# AFTER:")
lines.append("# flowchart TB")
lines.append("# accTitle: Title")
lines.append("```")
lines.append("")

lines.append("---")
lines.append("")
lines.append(f"_Report generated by mermaid-validator v1.0.0_")

report_path.write_text("\n".join(lines) + "\n", encoding="utf-8")

print(f"Markdown report: {report_path}")
print(f"JSON report: {json_report_path}")

# Exit with error if there are validation errors
sys.exit(1 if report['errors'] else 0)
PY
