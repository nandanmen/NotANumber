import React from 'react'
import { HiArrowRight } from 'react-icons/hi'
import tw, { styled, theme } from 'twin.macro'

import LiveEditor from '../shared/LiveEditor'
import CodeBlock from '../CodeBlock'
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
  mode = 'horizontal',
}) {
  const [code, setCode] = React.useState(initialCode)
  const result = useBabelPlugin(code, plugin)

  return (
    <>
      <div
        css={[
          tw`relative flex-1 h-full mb-4 text-sm`,
          mode === 'horizontal' && tw`md:(mr-4 mb-0)`,
        ]}
      >
        <LiveEditor value={code} onValueChange={setCode} />
        <Arrow mode={mode}>
          <HiArrowRight />
        </Arrow>
      </div>
      <div tw="flex-1">
        <CodeBlock tw="h-full">{result}</CodeBlock>
      </div>
    </>
  )
}

// -- Default plugin --

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

// -- Styles --

const Arrow = styled.div`
  ${tw`flex items-center justify-center w-10 h-10 text-xl text-gray-500 bg-gray-200 border-2 border-gray-300 rounded-full dark:(bg-blacks-300 border-blacks-300 text-gray-200)`}

  --x: -50%;
  --y: 0;
  --angle: 90deg;
  --offset: -1.75rem;

  position: absolute;
  left: 50%;
  bottom: var(--offset);
  transform: translate(var(--x), var(--y)) rotate(var(--angle));

  ${({ mode }) =>
    mode === 'horizontal' &&
    `
    @media screen and (min-width: ${theme`screens.md`}) {
      --x: 0;
      --y: -50%;
      --angle: 0;

      left: auto;
      bottom: auto;
      right: var(--offset);
      top: 50%;
    }
  `}
`
