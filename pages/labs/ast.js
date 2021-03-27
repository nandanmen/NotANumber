import React from 'react'
import tw, { styled } from 'twin.macro'

import LiveEditor from '../../components/shared/LiveEditor'
import { Tree, useSyntaxTree } from '../../components/sandboxes/AstSandbox'

const starterCode = `function sum(a, b) {
  return a + b
}`

export default function AstSandboxPage() {
  const [code, setCode] = React.useState(starterCode)
  const tree = useSyntaxTree(code)

  return (
    <SandboxWrapper>
      <div tw="flex-1">
        <LiveEditor value={code} onValueChange={(code) => setCode(code)} />
      </div>
      <div tw="flex-1 font-mono text-sm overflow-y-scroll rounded-md px-8">
        <Tree tree={tree} code={code} />
      </div>
    </SandboxWrapper>
  )
}

const SandboxWrapper = styled.div`
  ${tw`flex w-full p-8 pt-24 space-x-8 overflow-hidden dark:text-white`}

  height: calc(100vh - 4rem);
`
