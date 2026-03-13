<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Git Graph — Simple (3–6 commits)

Single feature branch workflow. Use for basic branching examples and quick illustrations.

---

## Example: Feature Branch Workflow

```mermaid
gitGraph
 accTitle: Simple Feature Branch Workflow
 accDescr: Basic feature branch workflow showing creation, development, and merge back to main

 commit id: "🎉 Initial commit"
 branch feature/login
 checkout feature/login
 commit id: "🔐 Add auth"
 commit id: "✅ Add tests"
 checkout main
 merge feature/login
 commit id: "🚀 Deploy"
```

---

## Example: Hotfix Workflow

```mermaid
gitGraph
 accTitle: Hotfix Branch Workflow
 accDescr: Emergency hotfix workflow branching from production and merging back

 commit id: "🏷️ v1.0.0"
 branch hotfix/security
 checkout hotfix/security
 commit id: "🛡️ Fix vulnerability"
 checkout main
 merge hotfix/security
 commit id: "🏷️ v1.0.1"
```

---

## Example: Bug Fix Branch

```mermaid
gitGraph
 accTitle: Bug Fix Branch Workflow
 accDescr: Simple bug fix workflow with branch creation and merge

 commit id: "📦 Baseline"
 branch fix/memory-leak
 checkout fix/memory-leak
 commit id: "🔧 Fix leak"
 checkout main
 merge fix/memory-leak
```

---

## Copy-Paste Template

```mermaid
gitGraph
 accTitle: REPLACE WITH 3-8 WORD TITLE
 accDescr: REPLACE WITH 1-2 sentences describing what this workflow shows

 commit id: "🎉 Initial"
 branch feature/name
 checkout feature/name
 commit id: "⚙️ Change 1"
 commit id: "✅ Change 2"
 checkout main
 merge feature/name
 commit id: "🚀 Complete"
```

---

## Tips

- Keep main branch commits minimal (2–3)
- Feature branches should show 2–4 commits
- Use emojis in commit messages for quick scanning
- Always show the merge back to main
