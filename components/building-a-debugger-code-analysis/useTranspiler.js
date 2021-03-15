import React from 'react'
import * as Babel from '@babel/standalone'

function transpile({ types: t }) {
  return {
    visitor: {
      DebuggerStatement(path) {
        const scope = Object.keys(path.scope.getAllBindings())
        path.replaceWith(
          createSnapshot(
            t,
            scope.map((variable) => [variable, variable])
          )
        )
      },
    },
  }
}

function createSnapshot(t, scope) {
  return t.expressionStatement(
    t.callExpression(
      t.memberExpression(t.identifier('_variables'), t.identifier('push')),
      [createObjectExpression(t, scope)]
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

export default function useTranspiler(code, plugin = transpile) {
  const [result, setResult] = React.useState('')

  React.useEffect(() => {
    try {
      const result = Babel.transform(code, { plugins: [plugin] })
      setResult(result.code)
    } catch {
      // syntax error
    }
  }, [code, plugin])

  return result
}
