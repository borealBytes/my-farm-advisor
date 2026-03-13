<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Git Graph — Intermediate (6–12 commits)

Multi-branch workflow with parallel development. Use for team collaboration patterns.

---

## Example: Parallel Feature Development

```mermaid
gitGraph
 accTitle: Parallel Feature Development
 accDescr: Multiple feature branches developed in parallel and merged sequentially

 commit id: "🎉 Start"
 branch feature/auth
 checkout feature/auth
 commit id: "🔐 Login UI"
 commit id: "✅ Auth tests"
 checkout main
 branch feature/api
 checkout feature/api
 commit id: "⚡ API endpoint"
 commit id: "📊 Response format"
 checkout main
 merge feature/auth
 commit id: "🔀 Merge auth"
 merge feature/api
 commit id: "🔀 Merge API"
```

---

## Example: Release Branch Workflow

```mermaid
gitGraph
 accTitle: Release Branch Strategy
 accDescr: Release branch workflow with parallel development and version tagging

 commit id: "📦 v1.0 baseline"
 branch release/v1.1
 checkout release/v1.1
 commit id: "🐛 Fix bug A"
 commit id: "📚 Update docs"
 checkout main
 branch feature/new-ui
 checkout feature/new-ui
 commit id: "🎨 New component"
 commit id: "✅ Component tests"
 checkout release/v1.1
 commit id: "🏷️ v1.1.0"
 checkout main
 merge release/v1.1
```

---

## Example: Code Review Workflow

```mermaid
gitGraph
 accTitle: Code Review and Merge Workflow
 accDescr: Feature branch with review feedback iterations and final merge

 commit id: "📦 Baseline"
 branch feature/payments
 checkout feature/payments
 commit id: "💳 Payment logic"
 commit id: "🧪 Add tests"
 checkout main
 checkout feature/payments
 commit id: "📝 Review fixes"
 commit id: "✅ Final tests"
 checkout main
 merge feature/payments
 commit id: "🚀 Deployed"
```

---

## Copy-Paste Template

```mermaid
gitGraph
 accTitle: REPLACE WITH 3-8 WORD TITLE
 accDescr: REPLACE WITH 1-2 sentences describing what this workflow shows

 commit id: "🎉 Initial"
 branch feature/a
 checkout feature/a
 commit id: "⚙️ Work A1"
 commit id: "✅ Work A2"
 checkout main
 branch feature/b
 checkout feature/b
 commit id: "🔧 Work B1"
 commit id: "📊 Work B2"
 checkout main
 merge feature/a
 merge feature/b
 commit id: "🚀 Complete"
```

---

## Tips

- Show 2–3 parallel branches maximum
- Demonstrate the merge order clearly
- Use checkout before every branch switch
- Tag release commits with version numbers
