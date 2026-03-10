# Setup Farm Advisor Skills Hierarchy

## TL;DR

Organize agricultural skills into a hierarchical structure with proper Git LFS configuration for large data files (~7GB of satellite imagery, shapefiles, and reports).

**Deliverables:**
- Hierarchical skill structure under `skills/farm-advisor-skills/`
- Orchestration SKILL.md and README for the parent skill
- `.gitattributes` for LFS tracking
- Updated `.gitignore` for data folder

**Effort:** Medium (~30 min)  
**Parallel Execution:** YES - 4 independent tasks

---

## Context

The ag-skills-demo repo has:
- ~7GB of data (satellite imagery, farm data, reports)
- 20 skills that need hierarchical organization
- Pattern-based LFS tracking (no size thresholds)

Skills have been organized into categories:
- **eda/**: eda-compare, eda-correlate, eda-explore, eda-time-series, eda-visualize
- **data-sources/**: farm-data-rebuild, farm-intelligence-reporting
- **field-management/**: csb-field-sampling, field-boundaries, headlands-ring
- **imagery/**: landsat-imagery, sentinel2-imagery
- **soil/**: cdl-cropland, ssurgo-poster-cards, ssurgo-soil
- **strategy/**: crop-strategy, maturity-by-fips
- **admin/**: geoadmin-admin, interactive-web-map
- **weather/**: nasa-power-weather

---

## Execution Strategy

### Wave 1 (Parallel - Independent Tasks)

Task 1: Create orchestration SKILL.md
- Location: `skills/farm-advisor-skills/SKILL.md`
- Content: High-level overview with links to sub-skills
- Structure: Domain categories with tables

Task 2: Create README.md
- Location: `skills/farm-advisor-skills/README.md`
- Content: Quick reference and structure overview

Task 3: Create .gitattributes
- Location: `.gitattributes` (repo root)
- Content: LFS patterns for images, geospatial data, documents, archives

Task 4: Update .gitignore
- Location: `.gitignore` (repo root)
- Content: Ignore data/** but allow specific canonical artifacts

---

## TODOs

- [ ] 1. Create orchestration SKILL.md

**What to do:**
Create `skills/farm-advisor-skills/SKILL.md` with:
- Header with domain, license, attribution
- Overview section
- 8 category sections (EDA, Data Sources, Field Management, Imagery, Soil, Strategy, Admin, Weather)
- Each section has a table with skill name and purpose
- Relative links to sub-skills (e.g., `./eda/eda-compare/`)
- Data section explaining LFS
- Usage section with directory structure

**Must NOT do:**
- Modify existing skill files
- Change skill implementations
- Copy skill content

**Acceptance Criteria:**
- File exists at `skills/farm-advisor-skills/SKILL.md`
- Contains all 8 category sections
- Each skill has a purpose description
- All relative links are valid

**Commit:** YES - `feat(skills): add farm-advisor-skills orchestration SKILL.md`

---

- [ ] 2. Create README.md

**What to do:**
Create `skills/farm-advisor-skills/README.md` with:
- Title and brief description
- Structure overview listing 8 categories
- Quick start note
- License section

**Must NOT do:**
- Duplicate full skill documentation
- Add implementation details

**Acceptance Criteria:**
- File exists at `skills/farm-advisor-skills/README.md`
- Lists all 8 categories with brief descriptions
- Has license section

**Commit:** YES - group with Task 1

---

- [ ] 3. Create .gitattributes for LFS

**What to do:**
Create `.gitattributes` in repo root with patterns from ag-skills-demo:

```
# Images
*.png filter=lfs diff=lfs merge=lfs -text
*.jpg filter=lfs diff=lfs merge=lfs -text
*.jpeg filter=lfs diff=lfs merge=lfs -text
*.gif filter=lfs diff=lfs merge=lfs -text
*.webp filter=lfs diff=lfs merge=lfs -text
*.tiff filter=lfs diff=lfs merge=lfs -text
*.tif filter=lfs diff=lfs merge=lfs -text
*.svg filter=lfs diff=lfs merge=lfs -text

# Geospatial
*.nc filter=lfs diff=lfs merge=lfs -text
*.grd filter=lfs diff=lfs merge=lfs -text

# Data files
data/**/*.csv filter=lfs diff=lfs merge=lfs -text
data/**/*.geojson filter=lfs diff=lfs merge=lfs -text
data/**/*.json filter=lfs diff=lfs merge=lfs -text

# Documents
*.pdf filter=lfs diff=lfs merge=lfs -text
*.docx filter=lfs diff=lfs merge=lfs -text
*.pptx filter=lfs diff=lfs merge=lfs -text

# Archives
*.zip filter=lfs diff=lfs merge=lfs -text
*.tar.gz filter=lfs diff=lfs merge=lfs -text
```

**Must NOT do:**
- Add size-based rules (not supported by LFS)
- Track small text files as LFS

**Acceptance Criteria:**
- File exists at `.gitattributes`
- Contains patterns for images, geospatial, data, documents, archives
- Uses `filter=lfs diff=lfs merge=lfs -text` for all patterns

**Commit:** YES - `chore(git): add LFS tracking for data files`

---

- [ ] 4. Update .gitignore

**What to do:**
Add to existing `.gitignore` (if any) or create new:

```
# Data folder structure - ignore by default, allow specific
/data/**
!/data/README.md
!/data/scripts/
!/data/scripts/**
!/data/sql/
!/data/sql/**

# Binary data files
*.geojson
*.tif
*.nc
*.csv
*.xlsx
*.parquet
*.shp
*.shx
*.dbf
*.prj

# Output files
*.png
*.jpg
*.svg
*.pdf

# Archives
*.zip
*.tar.gz
```

**Must NOT do:**
- Remove existing gitignore entries
- Ignore the entire data directory (keep README and scripts)

**Acceptance Criteria:**
- `.gitignore` exists and includes data folder patterns
- `/data/**` is ignored
- `/data/README.md`, `/data/scripts/`, `/data/sql/` are allowed

**Commit:** YES - group with Task 3

---

## Final Verification

- [ ] All skills organized in `skills/farm-advisor-skills/` subdirectories
- [ ] SKILL.md and README.md exist in `skills/farm-advisor-skills/`
- [ ] `.gitattributes` has LFS patterns
- [ ] `.gitignore` properly excludes data files
- [ ] Run `git check-attr filter skills/farm-advisor-skills/**/*.png` to verify LFS

---

## Success Criteria

- [ ] Skills are organized hierarchically by domain
- [ ] Parent skill has orchestration SKILL.md
- [ ] Git LFS is configured for large files
- [ ] Data folder is properly excluded from git (except README/scripts)

---

## Notes

- LFS tracking is pattern-based, not size-based
- The ag-skills-demo repo has ~7GB of data (1.3G growers, 5.5G shared, 357M reporting)
- Satellite imagery (.tif files) is the largest component
- Skills follow OpenCode standard structure with SKILL.md and README.md
