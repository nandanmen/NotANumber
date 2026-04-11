import fs from "node:fs";

import { parseSourceRef } from "./parse-source-file.js";
import { applyMultipleLineEditsToSource, type StyleEdits } from "./patch-style.js";
import { resolveSafeSourcePath } from "./resolve-safe-path.js";

export type ApplyEditItem = {
  sourceFile: string;
  edits: StyleEdits;
};

export type ApplyResult = {
  sourceFile: string;
  ok: boolean;
  error?: string;
};

type FileBucket = {
  lineToEdits: Map<number, StyleEdits>;
  itemIndices: number[];
};

/** Group by absolute path, merge lines, one read/write per file; per-item results. */
export function applyEditsBatch(
  items: ApplyEditItem[],
  repoRoot: string,
): { applied: number; results: ApplyResult[]; writtenFiles: string[] } {
  const results: ApplyResult[] = items.map((item) => ({
    sourceFile: item.sourceFile,
    ok: false,
  }));

  const byAbsPath = new Map<string, FileBucket>();

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    try {
      const { relPath, line } = parseSourceRef(item.sourceFile);
      const abs = resolveSafeSourcePath(relPath, repoRoot);
      let bucket = byAbsPath.get(abs);
      if (!bucket) {
        bucket = { lineToEdits: new Map(), itemIndices: [] };
        byAbsPath.set(abs, bucket);
      }
      bucket.itemIndices.push(i);
      const prev = bucket.lineToEdits.get(line) ?? {};
      bucket.lineToEdits.set(line, { ...prev, ...item.edits });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      results[i] = { sourceFile: item.sourceFile, ok: false, error: msg };
    }
  }

  let applied = 0;
  const writtenFiles: string[] = [];

  for (const [absPath, bucket] of byAbsPath) {
    const uniqueIndices = [...new Set(bucket.itemIndices)];
    try {
      const code = fs.readFileSync(absPath, "utf8");
      const next = applyMultipleLineEditsToSource(code, bucket.lineToEdits);
      fs.writeFileSync(absPath, next, "utf8");
      writtenFiles.push(absPath);
      for (const i of uniqueIndices) {
        results[i] = { sourceFile: items[i].sourceFile, ok: true };
        applied += 1;
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      for (const i of uniqueIndices) {
        results[i] = {
          sourceFile: items[i].sourceFile,
          ok: false,
          error: msg,
        };
      }
    }
  }

  return { applied, results, writtenFiles };
}
