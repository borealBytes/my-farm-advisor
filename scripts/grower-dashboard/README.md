# KS Grower 02 Local Dashboard Workflow

## Generate the dashboard

Run the local generator from the repo root:

```bash
node --import tsx scripts/grower-dashboard/build-ks-grower-02.ts
```

## Output path

The generated HTML is written to:

```text
data/my-farm-advisor/growers/ks-grower-02/ks-grower-02-dashboard.html
```

## Review the local output

After generation, inspect the local artifact by opening the HTML file directly in a browser from your filesystem.

Suggested review flow:

1. Run the generator command.
2. Open `data/my-farm-advisor/growers/ks-grower-02/ks-grower-02-dashboard.html` in a browser.
3. Click through the field map and verify the downstream panels update for the selected field.

## Git hygiene

The generated HTML is a local-only artifact for review and should not be committed.

- Keep `data/my-farm-advisor/growers/ks-grower-02/ks-grower-02-dashboard.html` local.
- Do not `git add` the generated dashboard HTML.
