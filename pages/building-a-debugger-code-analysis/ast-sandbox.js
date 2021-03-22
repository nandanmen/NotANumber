import tw, { styled } from 'twin.macro'
import AstSandbox from '../../components/sandboxes/AstSandbox'

const starterCode = `function sum(a, b) {
  return a + b
}`

export default function AstSandboxPage() {
  return (
    <SandboxWrapper tw="font-mono">
      <AstSandbox initialCode={starterCode} />
    </SandboxWrapper>
  )
}

const SandboxWrapper = styled.div`
  ${tw`flex w-full p-8 space-x-2 overflow-hidden dark:text-white`}

  height: calc(100vh - 4rem);
`
