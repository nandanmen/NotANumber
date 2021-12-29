importScripts('https://unpkg.com/@babel/standalone@7.13.12/babel.min.js')

addEventListener('message', (evt) => {
  const { code, inputs } = evt.data
  const executable = Babel.transform(code, { plugins: [exportDefaultToReturn] })
  postMessage(execute(executable.code)(...inputs))
})

function execute(code) {
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
