import React from 'react'
import { styled } from '@/stitches'
import LiveEditor from '@/components/debugger/shared/LiveEditor'
import { useCode } from '@/lib/hooks/useCode'
import { slate } from '@radix-ui/colors'

const initialCode = `function isSingleCharacterToken(char) {
  // TODO: Your code here
  return false
}

export default function tokenize(input) {
  let current = 0
  const tokens = []

  while (current < input.length) {
    const char = input[current]
    if (isSingleCharacterToken(char)) {
      tokens.push(char)
    }
    current++
  }

  return tokens
}`

const initialInput = `console.log(message)`

export function Editor() {
  const [code, setCode] = React.useState(initialCode)
  const [input, setInput] = React.useState(initialInput)
  const [result, errors] = useCode<[string], string[]>(code, input)
  return (
    <Wrapper>
      <LiveEditor value={code} onValueChange={setCode} />
      <LiveEditor value={input} onValueChange={setInput} />
      <Output>
        <pre>
          {errors.length
            ? errors.join('\n')
            : `Tokens:\n${JSON.stringify(result)}`}
        </pre>
      </Output>
    </Wrapper>
  )
}

const Output = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  padding: '$4',
  background: slate.slate12,
  color: 'white',
  overflowX: 'scroll',
  fontFamily: '$mono',

  '@md': {
    borderRadius: '8px',
  },
})

const Wrapper = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gridTemplateRows: 'repeat(2, 1fr)',
  gap: '$4',

  '> :first-child': {
    gridRow: '1 / -1',
  },
})
