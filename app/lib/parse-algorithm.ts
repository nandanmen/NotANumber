import "server-only";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";
import { generate } from "@babel/generator";

const SNAPSHOT = "__snapshots";

export function parseAlgorithm(code: string) {
  const ast = parse(code);
  const declared = new Set<string>();
  traverse(ast, {
    FunctionDeclaration(path) {
      for (const name of getFunctionParams(path.node)) {
        declared.add(name);
      }
    },
    ArrowFunctionExpression(path) {
      for (const name of getFunctionParams(path.node)) {
        declared.add(name);
      }
    },
    FunctionExpression(path) {
      for (const name of getFunctionParams(path.node)) {
        declared.add(name);
      }
    },
    DebuggerStatement(path) {
      const scope = Object.keys(path.scope.getAllBindings()).filter((name) =>
        declared.has(name),
      );
      path.replaceWith(
        createSnapshot([...scope, { line: String(path.node.loc.start.line) }]),
      );
    },
    VariableDeclarator(path) {
      const names = getNames(path.node.id);
      for (const name of names) {
        declared.add(name);
      }
    },
  });
  const func = ast.program.body.at(0);
  const result = generate(ast).code;
  return `({
  "entryPoint": (__snapshots) => ${result},
  "params": ${JSON.stringify(getFunctionParams(func))},
})`;
}

// --

function getFunctionParams(func) {
  return func.params.flatMap((node) => getNames(node));
}

function getNames(node) {
  if (t.isIdentifier(node)) {
    return [node.name];
  }
  if (t.isArrayPattern(node)) {
    return node.elements.flatMap((node) =>
      node === null ? [] : getNames(node),
    );
  }
  if (t.isObjectPattern(node)) {
    return node.properties.flatMap((prop) => getNames(prop));
  }
  if (t.isObjectProperty(node)) {
    return getNames(node.key);
  }
  return [];
}

function createSnapshot(scope) {
  const parsedScope = scope
    .filter((scope) => (typeof scope === "string" ? scope !== SNAPSHOT : scope))
    .map((stringOrVal) => {
      if (typeof stringOrVal === "string") {
        return [stringOrVal, stringOrVal];
      }
      const [key, val] = Object.entries(stringOrVal)[0];
      return [key, val];
    });
  /* __snapshot.push({ ...scope }) */
  return t.expressionStatement(
    t.callExpression(
      t.memberExpression(t.identifier(SNAPSHOT), t.identifier("push")),
      [createObjectExpression(parsedScope)],
    ),
  );
}

function createObjectExpression(entries) {
  return t.objectExpression(
    entries.map(([key, val]) =>
      t.objectProperty(t.identifier(key), t.identifier(val)),
    ),
  );
}
