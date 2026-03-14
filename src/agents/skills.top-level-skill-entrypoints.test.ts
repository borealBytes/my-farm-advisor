import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = path.resolve(import.meta.dirname, "..", "..");
const skillsRoot = path.join(repoRoot, "skills");

function collectNestedSkillEntryPoints(dir: string): string[] {
  const nested: string[] = [];

  function walk(current: string, depth: number) {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const next = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(next, depth + 1);
        continue;
      }
      if (entry.isFile() && entry.name === "SKILL.md" && depth > 1) {
        nested.push(path.relative(repoRoot, next));
      }
    }
  }

  walk(dir, 0);
  return nested.toSorted();
}

describe("top-level skill entrypoints", () => {
  it("allows only top-level skills/*/SKILL.md entrypoints", () => {
    const nested = collectNestedSkillEntryPoints(skillsRoot);
    expect(nested).toEqual([]);
  });
});
