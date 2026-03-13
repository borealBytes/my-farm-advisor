# Handoff Summary Template

## Merge target

Merge this into `ag-skills-demo` as a new skill named `{skill-name}`, with the plotting logic kept in a script that can run standalone from the repo root.

Use this layout:

```text
ag-skills-demo/
  .opencode/skills/{skill-name}/
    SKILL.md
    README.md
    requirements.txt
    examples/
      example_invocation.md
    templates/
      handoff_summary.md
  scripts/{script_name}.py
  outputs/
    cards/
```

## Handoff summary

### PR title

Add `{skill-name}` skill and standalone {description}

### Purpose

This merge adds a reusable repo skill for {purpose}.

### What is being added

- `.opencode/skills/{skill-name}/SKILL.md` with task definition
- `.opencode/skills/{skill-name}/README.md` with setup and usage
- `.opencode/skills/{skill-name}/requirements.txt` with dependencies
- `scripts/{script_name}.py` as the executable implementation
- Examples and templates for future reuse

## Skill definition template

Use this structure for SKILL.md:

````yaml
---
name: {skill-name}
description: {description}
version: 1.0.0
author: Boreal Bytes
tags: [{tags}]
---

# {Title}

## Use this skill when
{conditions}

## Inputs
{inputs}

## Outputs
{outputs}

## Behavior
{behavior steps}

## Notes
{important notes}

## Script entrypoint
```bash
python scripts/{script_name}.py {args}
````

```

## Merge criteria

Accept this merge when:
- The script runs from repo root with only the listed dependencies installed
- The skill folder explains when to use the workflow and what files it emits
- A fresh user can {usage scenario}
- The output naming convention is stable and matches the README and skill docs
- The workflow remains {scope} and does not claim generalized support for other sources
```
