/** Split `relativePath:line` (last `:` + digits) into path and 1-based line. */
export function parseSourceRef(sourceFile: string): {
  relPath: string;
  line: number;
} {
  const lastColon = sourceFile.lastIndexOf(":");
  if (lastColon <= 0) {
    throw new Error(
      `Invalid sourceFile (expected path:line): ${JSON.stringify(sourceFile)}`,
    );
  }
  const lineStr = sourceFile.slice(lastColon + 1);
  if (!/^\d+$/.test(lineStr)) {
    throw new Error(
      `Invalid sourceFile (expected path:line): ${JSON.stringify(sourceFile)}`,
    );
  }
  const line = Number(lineStr);
  if (!Number.isInteger(line) || line < 1) {
    throw new Error(`Invalid line in sourceFile: ${JSON.stringify(sourceFile)}`);
  }
  const relPath = sourceFile.slice(0, lastColon);
  if (!relPath || relPath.includes("\0")) {
    throw new Error(`Invalid path in sourceFile: ${JSON.stringify(sourceFile)}`);
  }
  return { relPath, line };
}
