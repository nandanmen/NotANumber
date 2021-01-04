const { createMacro } = require('babel-plugin-macros')

module.exports = createMacro(snapshot)

function snapshot({ references, babel: { types: t } }) {
  if (!references.default) {
    return
  }
  references.default.forEach((path) => {
    const { loc } = path.parentPath.node

    const func = path.parentPath.node.arguments[0]
    const { start, end } = func
    const code = path.hub.file.code.slice(start, end)
    path.parentPath.traverse(
      {
        FunctionDeclaration(path) {
          getFunctionParams(t, path.node).forEach((name) =>
            this.declared.add(name)
          )
        },
        ArrowFunctionExpression(path) {
          getFunctionParams(t, path.node).forEach((name) =>
            this.declared.add(name)
          )
        },
        FunctionExpression(path) {
          getFunctionParams(t, path.node).forEach((name) =>
            this.declared.add(name)
          )
        },
        DebuggerStatement(path) {
          const scope = Object.keys(
            path.scope.getAllBindings()
          ).filter((name) => this.declared.has(name))
          path.replaceWith(
            createSnapshot(t, [
              ...scope,
              { line: String(path.node.loc.start.line - loc.start.line) },
            ])
          )
        },
        VariableDeclarator(path) {
          const names = getNames(t, path.node.id)
          names.forEach((name) => this.declared.add(name))
        },
      },
      { declared: new Set() }
    )
    const params = getFunctionParams(t, func)
    path.parentPath.replaceWith(
      t.objectExpression([
        t.objectProperty(
          t.identifier('entryPoint'),
          t.arrowFunctionExpression([t.identifier('__snapshots')], func)
        ),
        t.objectProperty(
          t.identifier('params'),
          t.stringLiteral(JSON.stringify(params))
        ),
        t.objectProperty(t.identifier('code'), t.stringLiteral(code)),
      ])
    )
  })
}

// --

const SNAPSHOT = '__snapshots'

function getFunctionParams(t, func) {
  return func.params.flatMap((node) => getNames(t, node))
}

function getNames(t, node) {
  if (t.isIdentifier(node)) {
    return [node.name]
  }
  if (t.isArrayPattern(node)) {
    return node.elements.flatMap((node) =>
      node === null ? [] : getNames(t, node)
    )
  }
  if (t.isObjectPattern(node)) {
    return node.properties.flatMap((prop) => getNames(t, prop))
  }
  if (t.isObjectProperty(node)) {
    return getNames(t, node.key)
  }
  return []
}

function createSnapshot(t, scope) {
  const parsedScope = scope
    .filter((scope) => (typeof scope === 'string' ? scope !== SNAPSHOT : scope))
    .map((stringOrVal) => {
      if (typeof stringOrVal === 'string') {
        return [stringOrVal, stringOrVal]
      } else {
        const [key, val] = Object.entries(stringOrVal)[0]
        return [key, val]
      }
    })
  /* __snapshot.push({ ...scope }) */
  return t.expressionStatement(
    t.callExpression(
      t.memberExpression(t.identifier(SNAPSHOT), t.identifier('push')),
      [createObjectExpression(t, parsedScope)]
    )
  )
}

function createObjectExpression(t, entries) {
  return t.objectExpression(
    entries.map(([key, val]) =>
      t.objectProperty(t.identifier(key), t.identifier(val))
    )
  )
}
