# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.

---

## Skill Priority Hierarchy

This project uses 1000+ skills. To ensure optimal performance, we follow a strict priority order:

### Tier 1: ALWAYS USE (Primary)

**These skills are invoked by default for almost every task:**

1. **superior-byte-works-wrighter** - Used most frequently (almost always)
2. **my-farm-advisor** - Key skill for the class being taught

### Tier 2: USE SECONDARY (Primary Project Skills)

3. **my-farm-breeding-trial-management** - Breeding trial workflows
4. **my-farm-qtl-analysis** - QTL analysis and genetics
5. **superior-byte-works-google-timesfm-forecasting** - Time series forecasting

### Tier 3: SUPPORTING (Scientific/Agent Skills)

**K-Dense Scientific Skills:**

- Use for: Bioinformatics, data analysis, literature review
- Examples: citation-management, clinical-reports, deeptools

**Antigravity Awesome Skills:**

- Use for: Agent orchestration, automation, development
- Examples: agent-orchestrator, ai-engineer, agent-memory-mcp

### Default Skill Selection Priority

```
1. Check if wrighter is relevant → USE
2. Check if my-farm-advisor is relevant → USE
3. Check Tier 2 skills for relevance → USE if applicable
4. Check Tier 3 only if task requires specific domain expertise
```
