import { CodePreview } from '@/components/CodePreview'
import { styled } from '@/stitches'

import { CharacterList } from './CharacterList'
import snapshot from '../../lib/snapshot.macro'

const boilerplate = snapshot(function tokenize(input) {
  let current = 0
  let tokens = []

  while (current < input.length) {
    // parse tokens
    debugger
    current++
  }

  debugger
  return tokens
})

export function Boilerplate() {
  return (
    <CodePreview
      algorithm={boilerplate}
      initialInputs={['console.log(message)\nconsole']}
      delay={300}
      controls
      editable
    >
      {(context) => (
        <Wrapper>
          <CharacterList state={context.state} />
        </Wrapper>
      )}
    </CodePreview>
  )
}

const Wrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
})
