import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { resolveSafeSourcePath } from "./resolve-safe-path.js";

describe("resolveSafeSourcePath", () => {
  it("resolves a file under root", () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "apply-style-"));
    const rel = "src/Component.tsx";
    const full = path.join(root, rel);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, "export {};\n", "utf8");
    expect(resolveSafeSourcePath(rel, root)).toBe(path.resolve(full));
  });

  it("rejects path traversal", () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "apply-style-"));
    expect(() =>
      resolveSafeSourcePath("../../etc/passwd", root),
    ).toThrow(/escapes repo root/);
  });

  it("rejects disallowed extension", () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "apply-style-"));
    const f = path.join(root, "x.ts");
    fs.writeFileSync(f, "", "utf8");
    expect(() => resolveSafeSourcePath("x.ts", root)).toThrow(
      /Only \.tsx and \.jsx/,
    );
  });
});
