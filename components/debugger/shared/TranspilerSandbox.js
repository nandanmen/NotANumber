import React from 'react'
import { HiArrowRight } from 'react-icons/hi'
import tw, { styled, theme } from 'twin.macro'

import CodeBlock from '@/elements/CodeBlock'

import LiveEditor from './LiveEditor'
import useBabelPlugin from './useBabelPlugin'

const starterCode = `function sum(arr) {
  let sum = 0

  for (const num of arr) {
    debugger
    sum += num
  }

  return sum
}`

export default function TranspilerSandbox({
  initialCode = starterCode,
  plugin = transpile,
}) {
  const [code, setCode] = React.useState(initialCode)
  const [result, error] = useBabelPlugin(code, plugin)

  return (
    <SandboxWrapper>
      <CodeInput>
        <LiveEditor value={code} onValueChange={setCode} />
        <Arrow>
          <HiArrowRight />
        </Arrow>
      </CodeInput>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <CodeOutput>
        <CodeBlock>{result}</CodeBlock>
      </CodeOutput>
    </SandboxWrapper>
  )
}

// -- Default plugin --

function transpile() {
  return {
    visitor: {
      DebuggerStatement(path) {
        const scope = Object.keys(path.scope.getAllBindings())
        path.replaceWithSourceString(`_variables.push({ ${scope.join()} })`)
      },
    },
  }
}

// -- Styles --

const SandboxWrapper = styled.div`
  display: grid;
  gap: 16px;
  grid-template-areas:
    'input'
    'error'
    'output';

  @media screen and (min-width: ${theme`screens.md`}) {
    grid-template-areas:
      'input output'
      'error error';
  }
`

const CodeInput = styled.div`
  grid-area: input;
  position: relative;
`

const CodeOutput = styled.div`
  grid-area: output;
`

const ErrorMessage = styled.pre`
  ${tw`text-sm`};
  grid-area: error;
`

const Arrow = styled.div`
  ${tw`flex items-center justify-center w-10 h-10 text-xl rounded-full`}

  --x: -50%;
  --y: 0;
  --angle: 90deg;
  --offset: -1.75rem;

  position: absolute;
  left: 50%;
  bottom: var(--offset);
  transform: translate(var(--x), var(--y)) rotate(var(--angle));
  background: var(--brown);
  border: 2px solid var(--border-color);

  @media screen and (min-width: ${theme`screens.md`}) {
    --x: 0;
    --y: -50%;
    --angle: 0;

    left: auto;
    bottom: auto;
    right: var(--offset);
    top: 50%;
  }
`
