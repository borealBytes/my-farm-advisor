import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { writeSkill } from "./skills.e2e-test-helpers.js";
import { loadWorkspaceSkillEntries } from "./skills.js";

const tempDirs: string[] = [];

async function createTempWorkspaceDir() {
  const workspaceDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-"));
  tempDirs.push(workspaceDir);
  return workspaceDir;
}

afterEach(async () => {
  await Promise.all(
    tempDirs.splice(0, tempDirs.length).map((dir) => fs.rm(dir, { recursive: true, force: true })),
  );
});

describe("loadWorkspaceSkillEntries", () => {
  it("handles an empty managed skills dir without throwing", async () => {
    const workspaceDir = await createTempWorkspaceDir();
    const managedDir = path.join(workspaceDir, ".managed");
    await fs.mkdir(managedDir, { recursive: true });

    const entries = loadWorkspaceSkillEntries(workspaceDir, {
      managedSkillsDir: managedDir,
      bundledSkillsDir: path.join(workspaceDir, ".bundled"),
    });

    expect(entries).toEqual([]);
  });

  it("loads only top-level workspace skills", async () => {
    const workspaceDir = await createTempWorkspaceDir();

    await writeSkill({
      dir: path.join(workspaceDir, "skills", "visible-skill"),
      name: "visible-skill",
      description: "Visible",
    });
    await writeSkill({
      dir: path.join(workspaceDir, ".managed", "managed-skill"),
      name: "managed-skill",
      description: "Managed",
    });
    await writeSkill({
      dir: path.join(workspaceDir, ".bundled", "bundled-skill"),
      name: "bundled-skill",
      description: "Bundled",
    });

    const entries = loadWorkspaceSkillEntries(workspaceDir, {
      config: {
        plugins: {
          entries: { diffs: { enabled: true } },
          allow: ["open-prose"],
        },
      },
      managedSkillsDir: path.join(workspaceDir, ".managed"),
      bundledSkillsDir: path.join(workspaceDir, ".bundled"),
    });

    expect(entries.map((entry) => entry.skill.name)).toEqual(["visible-skill"]);
  });

  it.runIf(process.platform !== "win32")(
    "skips workspace skill directories that resolve outside the workspace root",
    async () => {
      const workspaceDir = await createTempWorkspaceDir();
      const outsideDir = await createTempWorkspaceDir();
      const escapedSkillDir = path.join(outsideDir, "outside-skill");
      await writeSkill({
        dir: escapedSkillDir,
        name: "outside-skill",
        description: "Outside",
      });
      await fs.mkdir(path.join(workspaceDir, "skills"), { recursive: true });
      await fs.symlink(escapedSkillDir, path.join(workspaceDir, "skills", "escaped-skill"), "dir");

      const entries = loadWorkspaceSkillEntries(workspaceDir, {
        managedSkillsDir: path.join(workspaceDir, ".managed"),
        bundledSkillsDir: path.join(workspaceDir, ".bundled"),
      });

      expect(entries.map((entry) => entry.skill.name)).not.toContain("outside-skill");
    },
  );

  it.runIf(process.platform !== "win32")(
    "skips workspace skill files that resolve outside the workspace root",
    async () => {
      const workspaceDir = await createTempWorkspaceDir();
      const outsideDir = await createTempWorkspaceDir();
      await writeSkill({
        dir: outsideDir,
        name: "outside-file-skill",
        description: "Outside file",
      });
      const skillDir = path.join(workspaceDir, "skills", "escaped-file");
      await fs.mkdir(skillDir, { recursive: true });
      await fs.symlink(path.join(outsideDir, "SKILL.md"), path.join(skillDir, "SKILL.md"));

      const entries = loadWorkspaceSkillEntries(workspaceDir, {
        managedSkillsDir: path.join(workspaceDir, ".managed"),
        bundledSkillsDir: path.join(workspaceDir, ".bundled"),
      });

      expect(entries.map((entry) => entry.skill.name)).not.toContain("outside-file-skill");
    },
  );
});
