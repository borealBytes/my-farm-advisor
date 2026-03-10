<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Git Graphs

**Best for:** Branching strategies, release workflows, Git history visualization, collaboration patterns.

---

## When to Use

- Documenting Git branching strategies (GitFlow, trunk-based)
- Visualizing release workflows
- Showing feature branch lifecycle
- Explaining merge vs rebase workflows
- Onboarding developers to team Git practices

## When NOT to Use

- General process flows → use [Flowchart](../flowchart/index.md)
- Time-based project schedules → use [Gantt](../gantt/index.md)
- Decision trees → use [Flowchart](../flowchart/index.md)
- Complex state machines → use [State](../state/index.md)

---

## Syntax Reference

```
gitGraph
 accTitle: Title Here
 accDescr: Description here

 commit
 commit
 branch feature
 checkout feature
 commit
 commit
 checkout main
 merge feature
 commit
```

**Commands:**

- `commit` — create a commit on current branch
- `branch name` — create new branch from current
- `checkout name` — switch to branch
- `merge name` — merge branch into current
- `commit id: "message"` — commit with custom message

---

## Complexity Levels

| File                               | Commits | Use case                         |
| ---------------------------------- | ------- | -------------------------------- |
| [simple.md](simple.md)             | 3–6     | Single feature branch            |
| [intermediate.md](intermediate.md) | 6–12    | Multi-branch workflow            |
| [advanced.md](advanced.md)         | 12–20   | Full GitFlow or complex strategy |

---

## Key Tips

- Use `commit id: "emoji message"` for clarity
- Branch names should be descriptive (feature/auth, hotfix/login)
- Show the merge commit explicitly
- Use `checkout` before each branch operation
- Keep main branch commits minimal (focus on feature work)

## Anti-Patterns

```
%% ❌ Missing checkout before branch
gitGraph
 commit
 branch feature  %% Creates from wrong branch

%% ✅ Fix: checkout first
gitGraph
 commit
 branch main
 checkout main
 branch feature

%% ❌ Too many commits on main
gitGraph
 commit
 commit
 commit
 commit
 commit
 branch feature

%% ✅ Fix: focus on feature branches
gitGraph
 commit
 branch feature
 checkout feature
 commit
 commit
 checkout main
 merge feature
```

---

## Parser Gotchas

- Must `checkout` before committing to a branch
- Branch names cannot contain spaces (use hyphens)
- Merge direction matters — merges INTO current branch
- First commit must be on default branch
