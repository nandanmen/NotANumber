import React from 'react'
import { styled } from '@/stitches'
import { CodeEditor } from '@/components/CodeEditor'
import { useCode } from '@/lib/code/useCode'

const initialCode = `function isSingleCharacterToken(char) {
  // TODO: Your code here
  return false
}

// Don't remove this default export otherwise the code won't run!
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

const INPUT = `console.log(message)`

const outputCode = `Given:
  ${INPUT}
Expected:
  [".","(",")"]
Received:
  `

export function Editor() {
  const [code, setCode] = React.useState(initialCode)
  const state = useCode<[string], string[]>(code, [INPUT])

  return (
    <Wrapper>
      <CodeEditorWrapper>
        <CodeEditor value={code} onValueChange={setCode} />
      </CodeEditorWrapper>
      <Output>
        {outputCode +
          (state.state === 'done' ? JSON.stringify(state.result) : '')}
      </Output>
    </Wrapper>
  )
}

const Output = styled('pre', {
  display: 'flex',
  flexDirection: 'column',
  padding: '$6',
  fontFamily: '$mono',
  fontSize: '$sm',
  border: '2px solid $black',
  borderLeft: 'none',
  borderTopRightRadius: 4,
  borderBottomRightRadius: 4,
  background: '$grey200',
  overflow: 'auto',
})

const Wrapper = styled('div', {
  display: 'grid',
  gridTemplateColumns: '3fr 2fr',
})

const CodeEditorWrapper = styled('div', {
  '--border-color': '$colors$black',

  borderRadius: 0,
  borderTopLeftRadius: 4,
  borderBottomLeftRadius: 4,
  fontSize: '$sm',
  border: '2px solid var(--border-color)',
  background: 'white',
  padding: '$6',

  '&:focus-within': {
    '--border-color': '$colors$blue',
  },
})
