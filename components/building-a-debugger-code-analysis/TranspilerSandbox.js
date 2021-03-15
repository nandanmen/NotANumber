import React from 'react'
import { HiArrowRight } from 'react-icons/hi'
import tw, { styled, theme } from 'twin.macro'

import CodeBlock from '../CodeBlock'
import LiveEditor from './LiveEditor'
import useTranspiler from './useTranspiler'

const initialCode = `function sum(arr) {
  let sum = 0

  for (const num of arr) {
    debugger
    sum += num
  }

  return sum
}`

export default function TranspilerSandbox() {
  const [code, setCode] = React.useState(initialCode)
  const result = useTranspiler(code)

  return (
    <figure tw="font-mono md:flex" className="full-width-2x">
      <div tw="flex-1 text-sm h-full mb-4 md:(mr-4 mb-0) relative">
        <LiveEditor value={code} onValueChange={setCode} />
        <Arrow>
          <HiArrowRight />
        </Arrow>
      </div>
      <div tw="flex-1">
        <CodeBlock tw="h-full">{result}</CodeBlock>
      </div>
    </figure>
  )
}

const Arrow = styled.div`
  ${tw`flex items-center justify-center w-10 h-10 text-xl text-gray-500 bg-gray-200 border-2 border-gray-300 rounded-full dark:(bg-blacks-300 border-blacks-100 text-gray-200)`}

  --x: -50%;
  --y: 0;
  --angle: 90deg;
  --offset: -1.75rem;

  position: absolute;
  left: 50%;
  bottom: var(--offset);
  transform: translate(var(--x), var(--y)) rotate(var(--angle));

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
