import { expect, describe, test } from "vitest";
import { parsePath } from "./path";

describe("parsePath", () => {
  test("should return a path object", () => {
    const path = parsePath("M 0 0 L 1 1");
    const [move, line] = [path.at<"M">(0), path.at<"L">(1)];
    expect(move.code).toBe("M");
    expect(move.x).toBe(0);
    expect(move.y).toBe(0);
    expect(line.code).toBe("L");
    expect(line.x).toBe(1);
    expect(line.y).toBe(1);
  });

  test("path.toPathString() should return the entire path", () => {
    const code = "M 0 0 L 1 1";
    const path = parsePath(code);
    expect(path.toPathString()).toBe(code);
  });

  test("cmd.toPathString() should stringify the path", () => {
    const path = parsePath("M 0 0 L 1 1");
    expect(path.at(0).toPathString()).toBe("M 0 0");
    expect(path.at(1).toPathString()).toBe("L 1 1");
  });

  test(".absolute should return absolute commands", () => {
    const path = parsePath("M 10 10 l 1 1");
    const line = path.absolute.at(1);
    expect(line.code).toBe("L");
    expect(line.x0).toBe(10);
    expect(line.y0).toBe(10);
    expect(line.x).toBe(11);
    expect(line.y).toBe(11);
  });

  test("abs.toPathSection() should return valid path section", () => {
    const path = parsePath("M 10 10 L 1 1");
    expect(path.absolute.at(0).toPathSection()).toBe("M 0 0 M 10 10");
    expect(path.absolute.at(1).toPathSection()).toBe("M 10 10 L 1 1");
  });

  test("abs.toPathSection() should work with S commands", () => {
    const path = parsePath("M 10 10 C 20 20 30 30 40 40 S 50 50 60 60");
    expect(path.absolute.at(2).toPathSection()).toBe(
      "M 40 40 C 50 50 50 50 60 60"
    );
  });

  test("abs.toPathSection() should work with Z commands", () => {
    const path = parsePath("M 10 10 L 20 20 Z");
    expect(path.absolute.at(2).toPathSection()).toBe("M 20 20 L 10 10");
  });

  test(".set() should return a new copy of path", () => {
    const path = parsePath("M 0 0 L 1 1");
    const newPath = path.set<"M">(0, { x: 10, y: 10 });
    expect(path).not.toBe(newPath);
    const newMove = newPath.at<"M">(0);
    expect(newMove.x).toBe(10);
    expect(newMove.y).toBe(10);
  });

  test(".toPathString() should update after .set()", () => {
    const path = parsePath("M 0 0 L 1 1");
    const newPath = path.set<"M">(0, { x: 10, y: 10 });
    expect(newPath.toPathString()).toBe("M 10 10 L 1 1");
  });

  test(".absolute should be up to date after .set()", () => {
    const path = parsePath("M 10 10 l 1 1");
    const newPath = path.set<"M">(0, { x: 5, y: 5 });
    const line = newPath.absolute.at(1);
    expect(line.x).toBe(6);
    expect(line.y).toBe(6);
  });

  test(".setAbsolute() should map to relative commands", () => {
    const path = parsePath("M 10 10 l 1 1");
    const newPath = path.setAbsolute(1, { x: 5, y: 5 });
    const line = newPath.at<"l">(1);
    expect(line.x).toBe(-5);
    expect(line.y).toBe(-5);
    expect(newPath.toPathString()).toBe("M 10 10 l -5 -5");
  });

  test(".setAbsolute() should work with absolute commands", () => {
    const path = parsePath("M 10 10 L 20 20");
    const newPath = path.setAbsolute(1, { x: 5, y: 5 });
    const line = newPath.at<"L">(1);
    expect(line.x).toBe(5);
    expect(line.y).toBe(5);
    expect(newPath.toPathString()).toBe("M 10 10 L 5 5");
  });
});
