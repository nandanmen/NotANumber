const SNAPSHOT = "__snapshots";

// Main

export default function transformFactory({ types: t }) {
  return {
    visitor: {
      Program(path) {
        const defaultExport = path.node.body.find((statement) =>
          t.isExportDefaultDeclaration(statement)
        );
        assertDefaultExportExists(defaultExport);

        const inferredData = checkAndGetEntryPoint(t, path, defaultExport);
        if (inferredData.type === "Identifier") {
          const declaration = checkAndGetEntryDeclaration(
            t,
            path.node,
            inferredData.entryPoint
          );
          inferredData.params = getFunctionParams(t, declaration);
        }

        const visitor = {
          /**
           * We've already analyzed the entry point here, so we're only updating the
           * AST i.e. removing the node if it's an identifier, or updating it to a
           * variable declaration otherwise.
           */
          ExportDefaultDeclaration(path) {
            const { declaration } = path.node;
            /**
             * If we're default exporting a variable name, remove the default export
             * altogether so we don't have duplicate bindings. Otherwise, replace it
             * with a VariableDeclaration.
             */
            if (t.isIdentifier(declaration)) {
              path.remove();
            } else {
              let expression = declaration;
              if (t.isFunctionDeclaration(declaration)) {
                expression = t.functionExpression(
                  declaration.id,
                  declaration.params,
                  declaration.body
                );
              }
              path.replaceWith(
                createVariable(t, t.identifier(inferredData.entryPoint), expression)
              );
            }
          },
          FunctionDeclaration(path) {
            getFunctionParams(t, path.node).forEach((name) =>
              this.declared.add(name)
            );
          },
          ArrowFunctionExpression(path) {
            getFunctionParams(t, path.node).forEach((name) =>
              this.declared.add(name)
            );
          },
          FunctionExpression(path) {
            getFunctionParams(t, path.node).forEach((name) =>
              this.declared.add(name)
            );
          },
          DebuggerStatement(path) {
            const scope = Object.keys(path.scope.getAllBindings()).filter((name) =>
              this.declared.has(name)
            );
            path.replaceWith(
              createSnapshot(t, [
                ...scope,
                { line: String(path.node.loc?.start.line) },
              ])
            );
          },
          VariableDeclarator(path) {
            const names = getNames(t, path.node.id);
            names.forEach((name) => this.declared.add(name));
          },
        };

        path.traverse(visitor, { declared: new Set() });

        buildMetadata(t, path.node, inferredData);
      },
    },
  };
}

// Helpers

function checkAndGetEntryDeclaration(t, program, entryPoint) {
  const declarations = program.body.filter((node) => t.isVariableDeclaration(node));
  for (const declaration of declarations) {
    const match = declaration.declarations.find(
      (node) => node.id.name === entryPoint
    );
    if (match) {
      if (declaration.kind !== "const") {
        throw new Error(
          `Sorry, we currently don't allow for '${declaration.kind}' default exports. Please change your '${declaration.kind}' declaration to a 'const'.`
        );
      }

      if (
        !t.isFunctionExpression(match.init) &&
        !t.isArrowFunctionExpression(match.init)
      ) {
        throw new Error(
          `Default export isn't a function. Make sure you're only default exporting functions.`
        );
      }

      return match.init;
    }
  }
}

function assertDefaultExportExists(defaultExport) {
  if (!defaultExport) {
    throw new Error(
      `Couldn't find an entry point. Did you forget to default export a function?`
    );
  }
}

function checkAndGetEntryPoint(t, path, { declaration }) {
  if (
    !t.isIdentifier(declaration) &&
    !t.isFunctionDeclaration(declaration) &&
    !t.isArrowFunctionExpression(declaration)
  ) {
    throw new Error(
      `Default export isn't a function. Make sure you're only default exporting functions.`
    );
  }

  let entryPoint = null;
  let params = [];
  let type = null;
  if (t.isIdentifier(declaration)) {
    entryPoint = declaration.name;
    type = "Identifier";
  } else if (t.isFunctionDeclaration(declaration)) {
    entryPoint = declaration.id?.name;
    type = "FunctionDeclaration";
  } else {
    type = "ArrowFunctionExpression";
  }

  if (!t.isIdentifier(declaration)) {
    params = getFunctionParams(t, declaration);
  }

  if (!entryPoint) {
    entryPoint = path.scope.generateUidIdentifier("entryPoint").name;
  }
  return { type, entryPoint, params };
}

function getFunctionParams(t, func) {
  return func.params.flatMap((node) => getNames(t, node));
}

function getNames(t, node) {
  if (t.isIdentifier(node)) {
    return [node.name];
  }
  if (t.isArrayPattern(node)) {
    return node.elements.flatMap((node) => (node === null ? [] : getNames(t, node)));
  }
  if (t.isObjectPattern(node)) {
    return node.properties.flatMap((prop) => getNames(t, prop));
  }
  if (t.isObjectProperty(node)) {
    return getNames(t, node.key);
  }
  return [];
}

// Node builders

function buildMetadata(t, program, data) {
  const params = t.identifier("__params");
  program.body.push(
    createVariable(
      t,
      params,
      t.arrayExpression(data.params.map((name) => t.stringLiteral(name)))
    )
  );

  const entryPoint = t.identifier("__entryPoint");
  program.body.push(createVariable(t, entryPoint, t.identifier(data.entryPoint)));

  const meta = t.identifier("__meta");
  program.body.push(
    createVariable(
      t,
      meta,
      createObjectExpression(
        t,
        ["__params", "__entryPoint", SNAPSHOT].map((name) => [name.slice(2), name])
      )
    )
  );
  program.body.push(t.returnStatement(meta));
}

function createVariable(t, id, init) {
  return t.variableDeclaration("const", [t.variableDeclarator(id, init)]);
}

function createSnapshot(t, scope) {
  const parsedScope = scope
    .filter((scope) => (typeof scope === "string" ? scope !== SNAPSHOT : scope))
    .map((stringOrVal) => {
      if (typeof stringOrVal === "string") {
        return [stringOrVal, stringOrVal];
      } else {
        const [key, val] = Object.entries(stringOrVal)[0];
        return [key, val];
      }
    });
  /* __snapshot.push({ ...scope }) */
  return t.expressionStatement(
    t.callExpression(
      t.memberExpression(t.identifier(SNAPSHOT), t.identifier("push")),
      [createObjectExpression(t, parsedScope)]
    )
  );
}

function createObjectExpression(t, entries) {
  return t.objectExpression(
    entries.map(([key, val]) =>
      t.objectProperty(t.identifier(key), t.identifier(val))
    )
  );
}
