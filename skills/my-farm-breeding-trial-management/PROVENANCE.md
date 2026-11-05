# Import Provenance

## my-farm-breeding-trial-management
- source_repo: https://github.com/borealBytes/my-farm-advisor.git
- source_local_path: /media/clay/Data/dev/scientific-agent-skills-worktrees/scientific-agent-skills-breeding-trial-management
- source_ref: feat/breeding-trial-management
- source_commit: f479f5d2d494d12c8b60fbdc338bf1219dd5a0d1
- source_status: untracked worktree subtree in the local breeding-trial-management worktree snapshot
- source_path: local breeding-trial-management subtree snapshot
- destination_path: my-farm-breeding-trial-management/
- import_date: 2026-04-28
- remote_baseline_ref: main
- remote_baseline_commit: 4a82ab779e8374035ca5e15f1cb1c0571395dc3d
- remote_baseline_path: skills/my-farm-breeding-trial-management/
- exclusions: `.git/`; any unrelated scientific skills outside the imported breeding-trial-management subtree; remote flat-layout paths that would overwrite the grouped local example taxonomy
- local_modifications: Copied the local untracked skill tree as the structural base; added root `README.md` from the remote skill with grouped-path adjustments; backfilled remote-only `scripts/breeding_cli.py` and `examples/field-trial-placement/`; merged remote unified-CLI/tool-selection documentation into local `SKILL.md` while preserving local grouped examples and local `references/bms-api.md` + `references/breedbase-api.md`.
- update_procedure: Re-run `git branch --show-current`, `git rev-parse HEAD`, and `git status --short` in `/media/clay/Data/dev/scientific-agent-skills-worktrees/scientific-agent-skills-breeding-trial-management`; copy only the local breeding-trial-management subtree into `my-farm-breeding-trial-management/`; resolve `https://github.com/borealBytes/my-farm-advisor.git` `main` to a commit SHA; then re-apply the remote completeness backfill for `README.md`, `scripts/breeding_cli.py`, and `examples/field-trial-placement/` without replacing the grouped local taxonomy or adjusted reference files.
