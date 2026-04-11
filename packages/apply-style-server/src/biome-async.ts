import { spawn } from "node:child_process";
import fs from "node:fs";
import type http from "node:http";
import path from "node:path";

/** Run Biome format on `files` after the HTTP response has fully finished sending. */
export function scheduleBiomeFormatAfterResponse(
  res: http.ServerResponse,
  files: string[],
  repoRoot: string,
): void {
  if (files.length === 0) {
    return;
  }
  if (process.env.APPLY_STYLE_SKIP_BIOME === "1") {
    return;
  }
  const unique = [...new Set(files)];
  res.once("finish", () => {
    runBiomeFormatDetached(unique, repoRoot);
  });
}

function resolveLocalBiomeBin(repoRoot: string): string | null {
  const win = process.platform === "win32";
  const cmd = path.join(
    repoRoot,
    "node_modules",
    ".bin",
    win ? "biome.cmd" : "biome",
  );
  return fs.existsSync(cmd) ? cmd : null;
}

function runBiomeFormatDetached(files: string[], repoRoot: string): void {
  const localBin = resolveLocalBiomeBin(repoRoot);
  const cmd = localBin ?? "pnpm";
  const args = localBin
    ? ["format", "--write", ...files]
    : ["exec", "biome", "format", "--write", ...files];

  const child = spawn(cmd, args, {
    cwd: repoRoot,
    stdio: "ignore",
    detached: true,
  });
  child.unref();
  child.on("error", (err) => {
    console.error(
      "[apply-style-server] biome format failed to start:",
      err.message,
    );
  });
  child.on("close", (code) => {
    if (code !== 0 && code !== null) {
      console.error("[apply-style-server] biome format exited with code", code);
    }
  });
}
