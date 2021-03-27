import React from 'react'
import 'twin.macro'

import LiveEditor from '../shared/LiveEditor'
import { Tree, useSyntaxTree } from '../sandboxes/AstSandbox'

export default function EmbeddedSandbox({
  initialCode = '',
  depth = 0,
  showProps = false,
  whitelist = new Set(),
}) {
  const [code, setCode] = React.useState(initialCode)
  const [showAllProps, toggle] = React.useReducer((state) => !state, showProps)
  const tree = useSyntaxTree(code)

  return (
    <>
      <div tw="flex-1">
        <LiveEditor value={code} onValueChange={(code) => setCode(code)} />
      </div>
      <div tw="flex-1 font-mono text-sm overflow-x-scroll relative">
        <label tw="absolute top-0 right-0 z-20 text-gray-500">
          Show all properties
          <input
            tw="ml-2"
            type="checkbox"
            value={showAllProps}
            onChange={toggle}
          />
        </label>
        <Tree
          tree={tree}
          depth={depth}
          code={code}
          variant={showAllProps ? Tree.variants.Detail : Tree.variants.Node}
          whitelist={whitelist}
        />
      </div>
    </>
  )
}
