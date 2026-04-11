import { describe, expect, it } from "vitest";

import { parseSourceRef } from "./parse-source-file.js";

describe("parseSourceRef", () => {
  it("parses path:line", () => {
    expect(parseSourceRef("app/foo.tsx:145")).toEqual({
      relPath: "app/foo.tsx",
      line: 145,
    });
  });

  it("uses last colon for line (unusual path segments)", () => {
    expect(parseSourceRef("weird:path/file.tsx:12")).toEqual({
      relPath: "weird:path/file.tsx",
      line: 12,
    });
  });

  it("rejects missing line", () => {
    expect(() => parseSourceRef("app/foo.tsx")).toThrow(/path:line/);
  });

  it("rejects non-numeric line suffix", () => {
    expect(() => parseSourceRef("app/foo.tsx:ab")).toThrow(/path:line/);
  });
});
