import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { promises as fs } from "node:fs";
import path from "node:path";

type SkillEntry = {
  name: string;
  path: string;
  files: number;
  bytes: number;
  hash: string;
};

async function main(): Promise<void> {
  const repoRoot = path.resolve(".");
  const skillsRoot = path.join(repoRoot, "skills");
  const manifestPath = path.join(repoRoot, "skills-manifest.json");

  const skillDirs = await findSkillDirectories(skillsRoot);
  skillDirs.sort((a, b) => a.localeCompare(b));

  const entries: SkillEntry[] = [];
  for (const dir of skillDirs) {
    const absoluteDir = path.join(skillsRoot, dir);
    const stats = await hashDirectory(absoluteDir);
    entries.push({
      name: path.basename(dir),
      path: dir.replace(/\\/g, "/"),
      files: stats.files,
      bytes: stats.bytes,
      hash: stats.hash,
    });
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    source: "skills",
    skillCount: entries.length,
    entries,
  };

  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(`Wrote skills manifest with ${entries.length} entries to ${manifestPath}`);
}

async function findSkillDirectories(root: string): Promise<string[]> {
  const results: string[] = [];
  await walk(root, async (_absPath, relPath, direntNames) => {
    if (relPath === "") {
      return;
    }
    if (direntNames.includes("SKILL.md")) {
      results.push(relPath);
    }
  });
  return results;
}

async function walk(
  dir: string,
  onDir: (abs: string, rel: string, entries: string[]) => Promise<void>,
  relative = "",
): Promise<void> {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const names = dirents.map((entry) => entry.name);
  await onDir(dir, relative, names);
  for (const dirent of dirents) {
    if (!dirent.isDirectory()) {
      continue;
    }
    const childAbs = path.join(dir, dirent.name);
    const childRel = relative === "" ? dirent.name : path.join(relative, dirent.name);
    await walk(childAbs, onDir, childRel);
  }
}

async function hashDirectory(dir: string): Promise<{ hash: string; bytes: number; files: number }> {
  const hash = createHash("sha256");
  let fileCount = 0;
  let byteCount = 0;

  async function walkDir(current: string): Promise<void> {
    const dirents = await fs.readdir(current, { withFileTypes: true });
    dirents.sort((a, b) => a.name.localeCompare(b.name));
    for (const dirent of dirents) {
      const absPath = path.join(current, dirent.name);
      const relPath = path.relative(dir, absPath).replace(/\\/g, "/");
      if (dirent.isDirectory()) {
        hash.update(`dir:${relPath}\0`);
        await walkDir(absPath);
        continue;
      }
      if (!dirent.isFile()) {
        continue;
      }
      const stat = await fs.stat(absPath);
      fileCount += 1;
      byteCount += stat.size;
      hash.update(`file:${relPath}:${stat.size}:${Math.floor(stat.mtimeMs)}\0`);
      await hashFile(absPath, hash);
    }
  }

  await walkDir(dir);
  return { hash: hash.digest("hex"), bytes: byteCount, files: fileCount };
}

function hashFile(filePath: string, hash: ReturnType<typeof createHash>): Promise<void> {
  return new Promise((resolve, reject) => {
    const stream = createReadStream(filePath);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("error", (error) => reject(error));
    stream.on("end", () => resolve());
  });
}

main().catch((error) => {
  console.error("Failed to build skills manifest", error);
  process.exitCode = 1;
});
