import React from 'react'
import useBabelPlugin from '@/components/debugger/shared/useBabelPlugin'

/**
 * Given a source script, executes it and returns the result. Uses the
 * default export of the script as its entry point.
 */
export function useCode<InputTypes extends any[], ReturnType>(
  code: string,
  ...inputs: InputTypes
): [ReturnType, string[]] {
  const [executable, syntaxError] = useBabelPlugin(code, exportDefaultToReturn)
  const [runtimeError, setRuntimeError] = React.useState(null)
  const [result, setResult] = React.useState(null)

  React.useEffect(() => {
    try {
      setRuntimeError(null)
      setResult(execute(executable)(...inputs))
    } catch (e) {
      console.error(e)
      setRuntimeError(e.message)
    }
  }, [executable, JSON.stringify(inputs)])

  const errors = [runtimeError, syntaxError].filter(Boolean)
  return [result, errors]
}

function execute(code: string) {
  return new Function(code)()
}

function exportDefaultToReturn({ types: t }) {
  return {
    visitor: {
      ExportDefaultDeclaration(path) {
        let { declaration: returnNode } = path.node
        if (t.isFunctionDeclaration(returnNode)) {
          returnNode = t.functionExpression(
            returnNode.id,
            returnNode.params,
            returnNode.body
          )
        }
        path.replaceWith(t.returnStatement(returnNode))
      },
    },
  }
}
