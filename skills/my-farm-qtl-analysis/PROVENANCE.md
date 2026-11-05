# Import Provenance

## my-farm-qtl-analysis
- source_repo: https://github.com/borealBytes/my-farm-advisor.git
- source_local_path: /media/clay/Data/dev/scientific-agent-skills-worktrees/scientific-agent-skills-qtl-analysis
- source_ref: feat/qtl-analysis
- source_commit: f479f5d2d494d12c8b60fbdc338bf1219dd5a0d1
- source_status: untracked worktree subtree in the local qtl-analysis worktree snapshot
- source_path: local qtl-analysis subtree snapshot
- destination_path: my-farm-qtl-analysis/
- import_date: 2026-04-28
- exclusions: `.git/`; generated `examples/**/output/` artifacts; generated `scripts/output/` artifacts; no remote flattening of the local grouped example taxonomy; no unrelated files outside the imported qtl-analysis subtree snapshot
- local_modifications: Imported the local grouped example layout as the structural base, backfilled remote-only `README.md` and `scripts/qtl_cli.py`, merged richer remote SKILL sections without changing example-first behavior, normalized local-source path assumptions to `my-farm-qtl-analysis/`, preserved `scripts/verify_gpu_hpc.py` and `VISUALIZATION_SUMMARY.md`, and excluded generated outputs after asset audit.
- update_procedure: Re-run `GIT_MASTER=1 git ls-remote https://github.com/borealBytes/my-farm-advisor.git refs/heads/main`, capture the resolved baseline SHA for `skills/my-farm-qtl-analysis`, re-run `GIT_MASTER=1 git branch --show-current`, `GIT_MASTER=1 git rev-parse HEAD`, and `GIT_MASTER=1 git status --short` in `/media/clay/Data/dev/scientific-agent-skills-worktrees/scientific-agent-skills-qtl-analysis`, copy only the local qtl-analysis subtree snapshot into `my-farm-qtl-analysis/`, re-apply the remote backfill files and path normalization, repeat the asset audit, and update this record plus `IMPORT_MANIFEST.md` in the same commit.
