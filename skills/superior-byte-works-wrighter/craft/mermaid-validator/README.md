# Mermaid Validator Tool

This directory contains a Mermaid diagram validator for `wrighter` markdown content.

## Files

- `SKILL.md`: Skill-level contract and workflow integration
- `mermaid-validator.sh`: Python-based validation script
- `README.md`: This file

## Requirements

- `python3` (3.7+)
- No external dependencies required (uses standard library only)

## Quick Start

Run from repository root:

```bash
bash skills/_core/wrighter/craft/mermaid-validator/mermaid-validator.sh
```

Outputs:

- `mermaid-validation-report.md` - Human-readable report
- `mermaid-validation-report.json` - Machine-readable report

## Common Commands

Check a specific directory:

```bash
bash skills/_core/wrighter/craft/mermaid-validator/mermaid-validator.sh \
  --target skills/_core/wrighter
```

Run non-interactive (CI-safe):

```bash
bash skills/_core/wrighter/craft/mermaid-validator/mermaid-validator.sh \
  --non-interactive
```

## Report Structure

### Summary Section

- Total files scanned
- Total diagrams found
- Valid/Invalid counts
- Breakdown by diagram type

### Errors Section

Critical issues preventing rendering:

- Invalid diagram types
- Syntax errors
- Unclosed subgraphs

### Warnings Section

Recommendations:

- Missing accTitle/accDescr
- Unusual patterns
- Style suggestions

### Sample Valid Diagrams

Reference examples of correctly formatted diagrams.

## What Gets Validated

### Diagram Types

Checks for valid Mermaid v10 diagram types:

- flowchart (most common)
- sequenceDiagram
- pie, gantt, mindmap
- classDiagram, stateDiagram
- quadrantChart, xychart
- And more...

### Syntax Checks

- Direction keywords (TB, LR, etc.)
- Subgraph balancing
- Node definitions
- Arrow syntax

### Accessibility

- accTitle presence
- accDescr presence
- Proper placement (separate lines)

## Three-Phase Workflow

1. **Phase 1**: Write markdown with Mermaid diagrams
2. **Phase 2**: Run validator to check all diagrams
3. **Phase 3**: Fix any errors found, then re-run

## Exit Behavior

- Exit `0`: All diagrams valid or only warnings
- Exit `1`: One or more diagrams have errors
