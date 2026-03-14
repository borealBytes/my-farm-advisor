# Skill Priority Hierarchy

## Project Context

This project uses 1000+ skills across multiple repositories. To ensure optimal agent performance and relevant skill selection, we follow a strict priority order.

## Priority Tiers

### Tier 1: ALWAYS USE (Primary)

**These skills are invoked by default for almost every task:**

1. **superior-byte-works-wrighter** ⭐ HIGHEST PRIORITY
   - Used most frequently ("almost always writer gets used")
   - Core writing and documentation skill

2. **my-farm-advisor** ⭐ PRIMARY PROJECT SKILL
   - Key skill for the class being taught
   - Secondary primary after wrighter

### Tier 2: USE SECONDARY (Primary Project Skills)

**These are primary skills for this specific project:**

3. **my-farm-breeding-trial-management**
   - Core breeding trial workflows

4. **my-farm-qtl-analysis**
   - QTL analysis and genetics

5. **superior-byte-works-google-timesfm-forecasting**
   - Time series forecasting

### Tier 3: SUPPORTING (Scientific/Agent Skills)

**Use when specific domain expertise is needed:**

**K-Dense Scientific Skills (scientific-skills/):**

- Use for: Bioinformatics, data analysis, literature review, clinical reports
- Examples: citation-management, clinical-reports, deeptools, geopandas

**Antigravity Awesome Skills (skills/):**

- Use for: Agent orchestration, automation, development workflows
- Examples: agent-orchestrator, ai-engineer, agent-memory-mcp

## Usage Guidelines

### Default Skill Selection

```
Priority Order:
1. Check if wrighter is relevant → USE
2. Check if my-farm-advisor is relevant → USE
3. Check Tier 2 skills for relevance → USE if applicable
4. Check Tier 3 only if task requires specific domain expertise
```

### When to Use Supporting Skills

- **K-Dense**: For scientific computing, bioinformatics, data analysis, academic writing
- **Antigravity**: For agent development, automation, multi-agent workflows

### Skill Discovery

To see available skills:

```bash
# List all skills
openclaw skills list

# List by source
openclaw skills list --source k-dense
openclaw skills list --source antigravity
openclaw skills list --source canonical
```

## Implementation Notes

### In Docker Runtime

The bootstrap copies skills in this order:

1. Canonical skills (Tier 1 & 2) - always copied
2. K-Dense scientific skills - copied with filtering
3. Antigravity skills - copied with filtering

### For Agent Sessions

Agents should prioritize Tier 1 skills first, then Tier 2, then consider Tier 3 based on task requirements.

## Maintenance

When adding new skills, categorize them:

- **Tier 1**: Essential, always-loaded project skills
- **Tier 2**: Primary project-specific skills
- **Tier 3**: Supporting domain-specific skills

Update this document when skill priorities change.
