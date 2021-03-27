import React from 'react'
import tw, { styled } from 'twin.macro'

import LiveEditor from '../../components/shared/LiveEditor'
import { Tree, useSyntaxTree } from '../../components/sandboxes/AstSandbox'

const starterCode = `function sum(a, b) {
  return a + b
}`

export default function AstSandboxPage() {
  const [code, setCode] = React.useState(starterCode)
  const [showAllProps, toggle] = React.useReducer((state) => !state, false)
  const tree = useSyntaxTree(code)

  return (
    <SandboxWrapper>
      <div>
        <LiveEditor value={code} onValueChange={(code) => setCode(code)} />
      </div>
      <div tw="flex-1 font-mono text-sm overflow-y-scroll rounded-md relative">
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
          code={code}
          variant={showAllProps ? Tree.variants.Detail : Tree.variants.Node}
        />
      </div>
    </SandboxWrapper>
  )
}

const SandboxWrapper = styled.div`
  ${tw`flex flex-col w-full p-8 pt-24 space-y-8 overflow-hidden dark:text-white`}

  height: calc(100vh - 4rem);
`
