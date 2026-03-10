---
name: User Guide Writing
description: Guide for writing task-oriented user documentation that helps users accomplish goals
version: 1.0.0
author: Omni Unified Writing
---

# User Guide Writing

User guides are task-oriented: they help users accomplish specific goals. Unlike reference documentation (which describes what exists), user guides describe how to do things.

---

## ## User Guide vs. Reference

| Dimension   | User Guide                | Reference                    |
| ----------- | ------------------------- | ---------------------------- |
| Structure   | Task-oriented             | Feature-oriented             |
| Reader goal | "How do I do X?"          | "What does Y do?"            |
| Entry point | Table of contents by task | Alphabetical or by component |
| Tone        | Instructional, direct     | Descriptive, neutral         |
| Example     | "How to export a report"  | "`export()` method"          |

---

## ## Task-Based Structure

Every user guide is organized around tasks, not features.

**Wrong (feature-oriented):**

```
1. The Dashboard
2. The Settings Panel
3. The Export Module
4. The Notification System
```

**Right (task-oriented):**

```
1. Getting started
2. Creating your first project
3. Inviting team members
4. Exporting and sharing reports
5. Setting up notifications
```

---

## ## Task Page Template

Each task gets its own page:

```markdown
# [Task Name — verb phrase]

Brief description: what this task accomplishes and when to use it (1–2 sentences).

## Prerequisites

- [What the user needs before starting]
- [Required permissions or setup]

## Steps

1. [Action verb] [specific UI element or command].

   [Screenshot or diagram if helpful]

   > **Note:** [Optional clarification or warning]

2. [Next action].

3. [Continue until task complete].

## Result

[What the user sees or has when the task is complete.]

## Next steps

- [Related task 1]
- [Related task 2]

## Troubleshooting

| Problem   | Solution     |
| --------- | ------------ |
| [Symptom] | [Resolution] |
```

---

## ## Writing Style for User Guides

### Use imperative mood

| Wrong                                    | Right                       |
| ---------------------------------------- | --------------------------- |
| "The user should click Save."            | "Click **Save**."           |
| "You will need to navigate to Settings." | "Go to **Settings**."       |
| "It is necessary to enter your email."   | "Enter your email address." |

### Name UI elements precisely

| Wrong                | Right                                |
| -------------------- | ------------------------------------ |
| "Click the button"   | "Click **Export**"                   |
| "Go to the settings" | "Go to **Settings > Notifications**" |
| "Select the option"  | "Select **Weekly digest**"           |

**Formatting conventions:**

- **Bold** for UI element names: "Click **Save**"
- `Code` for values the user types: "Enter `admin@example.com`"
- _Italic_ for emphasis or new terms: "This creates a _workspace_"

### One action per step

| Wrong                                                                 | Right                                                                                  |
| --------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| "Click Settings and then select Notifications and enable the toggle." | 1. Click **Settings**. 2. Select **Notifications**. 3. Enable **Email notifications**. |

### State the result of each step

| Without result       | With result                                                   |
| -------------------- | ------------------------------------------------------------- |
| "Click **Save**."    | "Click **Save**. The project appears in your dashboard."      |
| "Run `npm install`." | "Run `npm install`. Dependencies install to `node_modules/`." |

---

## ## Prerequisite Section

Be explicit about what users need before starting:

```markdown
## Prerequisites

Before you begin, ensure you have:

- An account with **Admin** or **Editor** role (see [Managing roles](../admin/roles.md))
- At least one project created (see [Creating a project](./create-project.md))
- The data file in CSV format (max 50 MB)
```

---

## ## Warning and Note Callouts

Use callouts sparingly — overuse dilutes their impact.

| Callout       | When to use                              | Markdown               |
| ------------- | ---------------------------------------- | ---------------------- |
| **Note**      | Helpful but non-critical information     | `> **Note:** ...`      |
| **Important** | Information that affects the outcome     | `> **Important:** ...` |
| **Warning**   | Risk of data loss or irreversible action | `> **Warning:** ...`   |
| **Tip**       | Shortcut or best practice                | `> **Tip:** ...`       |

**Example:**

> **Warning:** Deleting a workspace is permanent and cannot be undone. All projects and data within the workspace will be deleted.

---

## ## Troubleshooting Section

Every user guide should end with a troubleshooting table:

```markdown
## Troubleshooting

| Problem                         | Likely cause             | Solution                                      |
| ------------------------------- | ------------------------ | --------------------------------------------- |
| "Permission denied" error       | Insufficient role        | Ask your admin to grant **Editor** access     |
| Export button is grayed out     | No data in date range    | Expand the date range or check filters        |
| File not appearing after upload | File exceeds 50 MB limit | Compress the file or split into smaller files |
| Changes not saving              | Session expired          | Refresh the page and log in again             |
```

---

## ## Information Architecture

For multi-page user guides, organize with a clear hierarchy:

```
Getting Started
├── Installation
├── First login
└── Quick tour

Core Tasks
├── Creating projects
├── Inviting team members
├── Managing data
└── Exporting reports

Advanced
├── Automation
├── Integrations
└── API access

Reference
├── Keyboard shortcuts
├── Glossary
└── Troubleshooting
```

---

## ## Accessibility

- Use descriptive link text: "See [Managing roles](../admin/roles.md)" not "click [here](../admin/roles.md)"
- Add alt text to all screenshots: `![Export dialog showing CSV and PDF options](./export-dialog.png)`
- Use numbered lists for sequential steps, bullet lists for non-sequential items
- Avoid directional language: "the button above" breaks on mobile

---

## ## See Also

- [api-documentation.md](api-documentation.md) — API reference docs
- [onboarding-doc.md](onboarding-doc.md) — Developer onboarding
- [../../templates/operations/runbook.md](../../templates/operations/runbook.md) — Operational runbooks
- [../../templates/operations/troubleshooting_guide.md](../../templates/operations/troubleshooting_guide.md) — Troubleshooting guides
