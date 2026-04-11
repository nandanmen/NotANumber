import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { applyEditsBatch } from "./apply-batch.js";

describe("applyEditsBatch", () => {
  it("writes merged styles for one file", () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "apply-batch-"));
    const rel = "src/Box.tsx";
    const full = path.join(root, rel);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    const initial = `export function Box() {
  return (
    <div className="box">
      x
    </div>
  );
}
`;
    fs.writeFileSync(full, initial, "utf8");

    const { applied, results, writtenFiles } = applyEditsBatch(
      [{ sourceFile: `${rel}:3`, edits: { width: 10 } }],
      root,
    );

    expect(applied).toBe(1);
    expect(writtenFiles).toEqual([full]);
    expect(results[0].ok).toBe(true);
    const next = fs.readFileSync(full, "utf8");
    expect(next).toContain("width:");
    expect(next).toContain("10");
  });

  it("batches two edits on same file into one write", () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "apply-batch-"));
    const rel = "src/Multi.tsx";
    const full = path.join(root, rel);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    const initial = `export function M() {
  return (
    <>
      <span className="a">a</span>
      <span className="b">b</span>
    </>
  );
}
`;
    fs.writeFileSync(full, initial, "utf8");

    const { applied, results } = applyEditsBatch(
      [
        { sourceFile: `${rel}:4`, edits: { width: 1 } },
        { sourceFile: `${rel}:5`, edits: { height: 2 } },
      ],
      root,
    );

    expect(applied).toBe(2);
    expect(results.every((r) => r.ok)).toBe(true);
    const next = fs.readFileSync(full, "utf8");
    expect(next).toMatch(/width:\s*1/);
    expect(next).toMatch(/height:\s*2/);
  });

  it("returns per-item error for invalid sourceFile", () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "apply-batch-"));
    const { applied, results } = applyEditsBatch(
      [{ sourceFile: "noline", edits: {} }],
      root,
    );
    expect(applied).toBe(0);
    expect(results[0].ok).toBe(false);
    expect(results[0].error).toMatch(/path:line/);
  });
});
