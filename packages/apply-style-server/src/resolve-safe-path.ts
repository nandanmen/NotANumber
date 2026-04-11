import fs from "node:fs";
import path from "node:path";

const ALLOWED_EXT = new Set([".tsx", ".jsx"]);

function isPathInsideRoot(resolvedFile: string, resolvedRoot: string): boolean {
  const rel = path.relative(resolvedRoot, resolvedFile);
  if (rel === "") {
    return true;
  }
  return !rel.startsWith("..") && !path.isAbsolute(rel);
}

/** Resolve `relPath` under `repoRoot` and ensure it stays inside the root; only `.tsx` / `.jsx`. */
export function resolveSafeSourcePath(
  relPath: string,
  repoRoot: string,
): string {
  const rootResolved = path.resolve(repoRoot);
  const joined = path.resolve(rootResolved, relPath);
  if (!isPathInsideRoot(joined, rootResolved)) {
    throw new Error(`Path escapes repo root: ${JSON.stringify(relPath)}`);
  }
  const ext = path.extname(joined).toLowerCase();
  if (!ALLOWED_EXT.has(ext)) {
    throw new Error(
      `Only .tsx and .jsx are supported, got ${JSON.stringify(ext)}`,
    );
  }
  let rootReal = rootResolved;
  try {
    rootReal = fs.realpathSync(rootResolved);
  } catch {
    /* repo root may not exist yet — use resolved */
  }
  try {
    const fileReal = fs.realpathSync(joined);
    if (!isPathInsideRoot(fileReal, rootReal)) {
      throw new Error(`Path escapes repo root (symlink): ${JSON.stringify(relPath)}`);
    }
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") {
      // New file not allowed for apply; but we need to read — ENO means skip realpath check for open
      return joined;
    }
    throw e;
  }
  return joined;
}
