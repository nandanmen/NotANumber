import { describe, expect, it } from "vitest";

import {
  applyMultipleLineEditsToSource,
  applyStyleEditsToSource,
} from "./patch-style.js";

describe("applyStyleEditsToSource", () => {
  it("adds style when missing", () => {
    const src = `export function A() {
  return (
    <div className="a">
      hi
    </div>
  );
}
`;
    const out = applyStyleEditsToSource(src, 3, { width: 100, marginTop: 8 });
    expect(out).toContain("style=");
    expect(out).toMatch(/width:\s*100/);
    expect(out).toMatch(/marginTop:\s*8/);
  });

  it("merges into existing plain object style", () => {
    const src = `export function A() {
  return <div style={{ width: 1 }} />;
}
`;
    const out = applyStyleEditsToSource(src, 2, { width: 200 });
    expect(out).toMatch(/width:\s*200/);
    expect(out).not.toMatch(/width:\s*1/);
  });

  it("throws on ambiguous line", () => {
    const src = `function A() {
  return (
    <>
      <div /><div />
    </>
  );
}
`;
    expect(() => applyStyleEditsToSource(src, 4, { x: 1 })).toThrow(
      /Ambiguous/,
    );
  });

  it("throws on unsupported style expression", () => {
    const src = `export function A() {
  return <div style={foo} />;
}
`;
    expect(() => applyStyleEditsToSource(src, 2, { width: 1 })).toThrow(
      /Unsupported style/,
    );
  });

  it("throws on object spread in style", () => {
    const src = `export function A() {
  return <div style={{ ...a, width: 1 }} />;
}
`;
    expect(() => applyStyleEditsToSource(src, 2, { height: 2 })).toThrow(
      /spread/,
    );
  });
});

describe("applyMultipleLineEditsToSource", () => {
  it("applies two lines in one file", () => {
    const src = `export function A() {
  return (
    <>
      <div className="a">one</div>
      <div className="b">two</div>
    </>
  );
}
`;
    const map = new Map<number, Record<string, string | number>>([
      [4, { color: "red" }],
      [5, { color: "blue" }],
    ]);
    const out = applyMultipleLineEditsToSource(src, map);
    expect(out).toMatch(/color:\s*['"]red['"]/);
    expect(out).toMatch(/color:\s*['"]blue['"]/);
  });
});
