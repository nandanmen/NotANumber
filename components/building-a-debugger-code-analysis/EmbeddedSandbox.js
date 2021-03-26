import React from 'react'
import 'twin.macro'

import LiveEditor from '../shared/LiveEditor'
import { Tree, useSyntaxTree } from '../sandboxes/AstSandbox'

export default function EmbeddedSandbox({ initialCode = '', depth = 2 }) {
  const [code, setCode] = React.useState(initialCode)
  const tree = useSyntaxTree(code)

  return (
    <>
      <div tw="flex-1">
        <LiveEditor value={code} onValueChange={(code) => setCode(code)} />
      </div>
      <div tw="flex-1 font-mono text-sm" className="full-width">
        <Tree tree={tree} depth={depth} code={code} />
      </div>
    </>
  )
}
