import React from 'react'
import { parse } from '@babel/parser'
import 'twin.macro'

import LiveEditor from '../../shared/LiveEditor'
import Tree from './Tree'

export default function AstSandbox({ initialCode = '', depth = 2 }) {
  const [code, setCode] = React.useState(initialCode)
  const [tree, setTree] = React.useState(
    parse(initialCode, { sourceType: 'module' })
  )

  React.useEffect(() => {
    try {
      const tree = parse(code, { sourceType: 'module' })
      setTree(tree)
    } catch (e) {
      // syntax error
    }
  }, [code])

  return (
    <>
      <div tw="flex-1">
        <LiveEditor value={code} onValueChange={(code) => setCode(code)} />
      </div>
      <div tw="flex-1">
        <Tree tree={tree} depth={depth} />
      </div>
    </>
  )
}
