# R2 Seed Pipeline

**Domain:** Infrastructure / Persistent Storage Bootstrap  
**License:** Apache-2.0  
**Attribution:** Superior Byte Works LLC / borealBytes

---

## Intent

Keep this skill tiny and operational:

- Seed baseline files from this skill’s `src/` into live storage at `data/moltbot/`
- Preserve live data across reboot/redeploy
- Use simple, auditable `rsync` commands only

Live data always wins unless you explicitly run the upgrade command.

---

## Paths

- **Seed source (repo):** `skills/my-farm-advisor/r2-seed-pipeline/src/`
- **Live destination (mounted R2 in runtime):** `/data/moltbot/`
- **Live destination (local dev checkout):** `data/moltbot/`

> Use `/data/moltbot/` in Cloudflare runtime.
> Use `data/moltbot/` locally.

---

## Commands (exact)

### 1) Safe Seed (append only, never overwrite)

```bash
rsync -r --no-times --ignore-existing \
  "skills/my-farm-advisor/r2-seed-pipeline/src/" \
  "/data/moltbot/"
```

Behavior:
- Copies only missing files
- Does **not** overwrite existing files
- Does **not** delete anything

### 2) Upgrade Seed (overwrite changed files, no delete)

```bash
rsync -r --no-times --checksum \
  "skills/my-farm-advisor/r2-seed-pipeline/src/" \
  "/data/moltbot/"
```

Behavior:
- Updates destination files when contents differ
- Creates missing files
- Does **not** delete anything (no `--delete`)

---

## Why these flags

- `-r` recursive copy
- `--no-times` required for s3fs/R2 mounts (timestamp writes are unreliable)
- `--ignore-existing` for additive safe seed
- `--checksum` for content-based upgrade behavior

---

## Minimal layout expectation

`src/` should mirror canonical runtime shape under `data/moltbot/`, e.g.:

```text
src/
├── growers/
├── shared/
└── scripts/
```

---

## Related Skills

- [farm-data-rebuild](../data-sources/farm-data-rebuild/)
- [farm-intelligence-reporting](../data-sources/farm-intelligence-reporting/)

---

## License

Apache-2.0 — See [LICENSE](../../../LICENSE) for full terms.
