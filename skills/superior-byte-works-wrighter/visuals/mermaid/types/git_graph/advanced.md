<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Git Graph — Advanced (12–20 commits)

Full GitFlow or complex branching strategy. Use for documenting team standards.

---

## Example: GitFlow Workflow

```mermaid
gitGraph
 accTitle: Full GitFlow Implementation
 accDescr: Complete GitFlow workflow with main, develop, feature, release, and hotfix branches

 commit id: "🎉 Init"
 branch develop
 checkout develop
 commit id: "📦 Setup"
 branch feature/auth
 checkout feature/auth
 commit id: "🔐 Auth module"
 commit id: "✅ Auth tests"
 checkout develop
 merge feature/auth
 branch feature/api
 checkout feature/api
 commit id: "⚡ API layer"
 commit id: "📊 API docs"
 checkout develop
 merge feature/api
 branch release/v1.0
 checkout release/v1.0
 commit id: "🐛 Bug fix"
 commit id: "📚 Final docs"
 checkout main
 merge release/v1.0
 commit id: "🏷️ v1.0.0"
 checkout develop
 merge release/v1.0
```

---

## Example: Multi-Environment Deployment

```mermaid
gitGraph
 accTitle: Multi Environment Deployment Flow
 accDescr: Complex workflow with staging, production, and multiple feature branches

 commit id: "🎉 Start"
 branch staging
 checkout staging
 commit id: "⚙️ Config"
 branch feature/search
 checkout feature/search
 commit id: "🔍 Search UI"
 commit id: "✅ Search tests"
 checkout staging
 merge feature/search
 branch feature/filters
 checkout feature/filters
 commit id: "🎚️ Filter logic"
 checkout staging
 merge feature/filters
 commit id: "🧪 Staging tests"
 checkout main
 merge staging
 commit id: "🏷️ Production"
 branch hotfix/critical
 checkout hotfix/critical
 commit id: "🚨 Critical fix"
 checkout main
 merge hotfix/critical
 checkout staging
 merge hotfix/critical
```

---

## Example: Monorepo Workflow

```mermaid
gitGraph
 accTitle: Monorepo Package Development
 accDescr: Workflow showing parallel package development in a monorepo structure

 commit id: "🎉 Monorepo init"
 branch develop
 checkout develop
 branch feature/ui-lib
 checkout feature/ui-lib
 commit id: "🎨 Button component"
 commit id: "✅ Button tests"
 checkout develop
 branch feature/api-client
 checkout feature/api-client
 commit id: "⚡ HTTP client"
 commit id: "🧪 Client tests"
 checkout feature/ui-lib
 commit id: "🎨 Input component"
 checkout develop
 merge feature/ui-lib
 branch feature/docs
 checkout feature/docs
 commit id: "📚 Storybook setup"
 checkout develop
 merge feature/api-client
 merge feature/docs
 branch release/packages
 checkout release/packages
 commit id: "📦 Version bump"
 checkout main
 merge release/packages
 commit id: "🏷️ Published"
```

---

## Copy-Paste Template

```mermaid
gitGraph
 accTitle: REPLACE WITH 3-8 WORD TITLE
 accDescr: REPLACE WITH 1-2 sentences describing what this workflow shows

 commit id: "🎉 Init"
 branch develop
 checkout develop
 branch feature/one
 checkout feature/one
 commit id: "⚙️ Work 1"
 commit id: "✅ Test 1"
 checkout develop
 branch feature/two
 checkout feature/two
 commit id: "🔧 Work 2"
 commit id: "📊 Test 2"
 checkout develop
 merge feature/one
 merge feature/two
 branch release/v1
 checkout release/v1
 commit id: "🏷️ Prepare"
 checkout main
 merge release/v1
 commit id: "🚀 Done"
```

---

## Tips

- Use consistent branch naming (feature/, hotfix/, release/)
- Show the full lifecycle from creation to merge
- Include version tags on main branch
- Demonstrate hotfix workflow if applicable
- Consider splitting very complex workflows into multiple diagrams
