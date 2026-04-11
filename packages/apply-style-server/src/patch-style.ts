import generateModule from "@babel/generator";
import { parse } from "@babel/parser";
import traverseModule from "@babel/traverse";
import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";

const generate = (
  (generateModule as { default?: typeof import("@babel/generator").default })
    .default ?? generateModule
) as typeof import("@babel/generator").default;
const traverse = (
  (traverseModule as { default?: typeof import("@babel/traverse").default })
    .default ?? traverseModule
) as typeof import("@babel/traverse").default;

export type StyleEdits = Record<string, string | number>;

function hasSpreadInObject(expr: t.ObjectExpression): boolean {
  return expr.properties.some((p) => t.isSpreadElement(p));
}

function getObjectPropertyKeyString(
  key: t.ObjectProperty["key"],
): string | null {
  if (t.isIdentifier(key)) {
    return key.name;
  }
  if (t.isStringLiteral(key)) {
    return key.value;
  }
  return null;
}

function styleKeyToProperty(key: string): {
  key: t.Expression;
  computed: boolean;
} {
  if (/^[a-zA-Z_$][\w$]*$/.test(key)) {
    return { key: t.identifier(key), computed: false };
  }
  return { key: t.stringLiteral(key), computed: true };
}

function valueToExpression(value: string | number): t.Expression {
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new Error("Invalid number in style edits");
    }
    return t.numericLiteral(value);
  }
  return t.stringLiteral(value);
}

function objectExpressionFromEdits(edits: StyleEdits): t.ObjectExpression {
  const props: t.ObjectProperty[] = [];
  for (const [k, v] of Object.entries(edits)) {
    const { key, computed } = styleKeyToProperty(k);
    props.push(t.objectProperty(key, valueToExpression(v), computed));
  }
  return t.objectExpression(props);
}

function mergeEditsIntoObjectExpression(
  expr: t.ObjectExpression,
  edits: StyleEdits,
): void {
  if (hasSpreadInObject(expr)) {
    throw new Error("Unsupported style: object spread in style={{ ... }}");
  }
  for (const prop of expr.properties) {
    if (!t.isObjectProperty(prop)) {
      throw new Error("Unsupported style: only plain object properties allowed");
    }
  }
  const editKeys = new Set(Object.keys(edits));
  expr.properties = expr.properties.filter((prop) => {
    if (!t.isObjectProperty(prop)) {
      return false;
    }
    const name = getObjectPropertyKeyString(prop.key);
    if (name == null) {
      throw new Error("Unsupported style: non-literal object key");
    }
    return !editKeys.has(name);
  });
  for (const [k, v] of Object.entries(edits)) {
    const { key, computed } = styleKeyToProperty(k);
    expr.properties.push(t.objectProperty(key, valueToExpression(v), computed));
  }
}

function getStyleObjectExpression(
  attr: t.JSXAttribute,
): t.ObjectExpression | null {
  if (!attr.value) {
    return null;
  }
  if (t.isStringLiteral(attr.value)) {
    throw new Error("Unsupported style: string literal style attribute");
  }
  if (!t.isJSXExpressionContainer(attr.value)) {
    throw new Error("Unsupported style attribute value");
  }
  const { expression } = attr.value;
  if (t.isObjectExpression(expression)) {
    return expression;
  }
  throw new Error(
    "Unsupported style: only style={{ ... }} with a plain object is supported",
  );
}

function findStyleAttributeIndex(
  attributes: (t.JSXAttribute | t.JSXSpreadAttribute)[],
): number {
  return attributes.findIndex(
    (a) =>
      t.isJSXAttribute(a) &&
      t.isJSXIdentifier(a.name) &&
      a.name.name === "style",
  );
}

/** Mutates `opening`: add or merge `style` from `edits`. */
export function applyStyleToOpeningElement(
  opening: t.JSXOpeningElement,
  edits: StyleEdits,
): void {
  const idx = findStyleAttributeIndex(opening.attributes);
  if (idx === -1) {
    const expr = objectExpressionFromEdits(edits);
    opening.attributes.push(
      t.jsxAttribute(
        t.jsxIdentifier("style"),
        t.jsxExpressionContainer(expr),
      ),
    );
    return;
  }
  const attr = opening.attributes[idx];
  if (!t.isJSXAttribute(attr)) {
    return;
  }
  const obj = getStyleObjectExpression(attr);
  if (!obj) {
    throw new Error("Unsupported style: empty style expression");
  }
  mergeEditsIntoObjectExpression(obj, edits);
}

function collectOpeningsOnLine(ast: t.File, line: number): t.JSXOpeningElement[] {
  const found: t.JSXOpeningElement[] = [];
  traverse(ast, {
    JSXOpeningElement(path: NodePath<t.JSXOpeningElement>) {
      const start = path.node.loc?.start?.line;
      if (start === line) {
        found.push(path.node);
      }
    },
  });
  return found;
}

/** Parse TSX and merge style on the single JSXOpeningElement at `line`. Returns new source. */
export function applyStyleEditsToSource(
  code: string,
  line: number,
  edits: StyleEdits,
): string {
  const ast = parse(code, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
    errorRecovery: false,
    tokens: true,
  });
  const openings = collectOpeningsOnLine(ast, line);
  if (openings.length === 0) {
    throw new Error(`No JSX opening element on line ${line}`);
  }
  if (openings.length > 1) {
    throw new Error(
      `Ambiguous: multiple JSX opening elements on line ${line}`,
    );
  }
  applyStyleToOpeningElement(openings[0], edits);
  return generate(ast, { retainLines: true }, code).code;
}

/** Single parse/generate: apply edits for many lines in one file. */
export function applyMultipleLineEditsToSource(
  code: string,
  lineToEdits: Map<number, StyleEdits>,
): string {
  const ast = parse(code, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
    errorRecovery: false,
    tokens: true,
  });
  const lines = [...lineToEdits.keys()].sort((a, b) => a - b);
  for (const line of lines) {
    const edits = lineToEdits.get(line);
    if (!edits || Object.keys(edits).length === 0) {
      continue;
    }
    const openings = collectOpeningsOnLine(ast, line);
    if (openings.length === 0) {
      throw new Error(`No JSX opening element on line ${line}`);
    }
    if (openings.length > 1) {
      throw new Error(
        `Ambiguous: multiple JSX opening elements on line ${line}`,
      );
    }
    applyStyleToOpeningElement(openings[0], edits);
  }
  return generate(ast, { retainLines: true }, code).code;
}
