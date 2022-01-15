import React from 'react'
import { styled } from '@/stitches'
import { CodeEditor } from '@/components/CodeEditor'
import { useCode } from '@/lib/code/useCode'

const INPUT = `console.log(message)`

const outputCode = `Given:
  ${INPUT}
Expected:
  [".","(",")"]
Received:
  `

type Test = {
  input: any[]
  expected: any
}

export function Editor({
  children,
  test,
}: {
  children: React.ReactNode
  test: Test
}) {
  const [code, setCode] = React.useState(getInitialCodeFromChildren(children))
  const state = useCode(code, test.input)

  const outputCode = `Given:
${test.input.join('\n')}
Expected:
${JSON.stringify(test.expected, null, 2)}
Received:
`

  return (
    <Wrapper>
      <CodeEditorWrapper>
        <CodeEditor value={code} onValueChange={setCode} />
      </CodeEditorWrapper>
      <Output>
        {outputCode +
          (state.state === 'done' ? JSON.stringify(state.result, null, 2) : '')}
      </Output>
    </Wrapper>
  )
}

function getInitialCodeFromChildren(children: React.ReactNode) {
  if (!children) {
    return ''
  }

  const { props } = children as React.ReactElement
  if (props.mdxType === 'pre') {
    return props.children.props.children
  }
  return ''
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
