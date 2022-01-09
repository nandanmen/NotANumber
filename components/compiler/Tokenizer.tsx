import { motion } from 'framer-motion'

import { CodePreview } from '@/components/CodePreview'
import { styled } from '@/stitches'

import { tokenize } from './lib/tokenizer'
import snapshot from '../../lib/snapshot.macro'

const boilerplate = snapshot(function tokenize(input) {
  let current = 0
  let tokens = []
  debugger

  while (current < input.length) {
    // parse tokens
    debugger
    current++
  }

  debugger
  return tokens
})

const algorithms = {
  boilerplate,
  tokenize,
}

const INPUT = `function hello(message) {
  console.log(message);
}`

type TokenType = {
  type: string
  name?: string
}

type TokenizerState = {
  input: string
  start: number
  current: number
  tokens: TokenType[]
}

export function Tokenizer({ name }: { name: string }) {
  return (
    <CodePreview
      algorithm={algorithms[name] ?? tokenize}
      initialInputs={['console.log(message)']}
      delay={300}
      controls
      editable
    >
      {(context) => <TokenizerVisual {...context} />}
    </CodePreview>
  )
}

function TokenizerVisual({ state, player }) {
  return (
    <Wrapper>
      <InputWrapper>
        {[...state.input].map((char, index) => {
          const isAtEnds =
            player.models.activeStepIndex === 0 ||
            player.models.activeStepIndex === player.models.steps.length - 1
          const isActive = index === state.current
          return (
            <InputCharacter
              key={index}
              type={char === ' ' ? 'empty' : undefined}
              active={isActive || isAtEnds}
            >
              {char === '\n' ? `\\n` : char}
              {isActive && !isAtEnds && <Cursor style={{ x: '-50%' }} />}
            </InputCharacter>
          )
        })}
      </InputWrapper>
      {state.tokens.length > 0 && (
        <Tokens>
          {state.tokens.map((token, index) => (
            <Token
              key={index}
              animate={{ y: 0, opacity: 1 }}
              initial={{ y: 4, opacity: 0 }}
            >
              <p>{token.type}</p>
              <p>{token.name}</p>
            </Token>
          ))}
        </Tokens>
      )}
    </Wrapper>
  )
}

const Tokens = styled('ul', {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  columnGap: '$4',
  marginTop: '$12',
})

const Token = styled(motion.li, {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '$4',
  fontFamily: '$mono',

  '> :first-child': {
    fontWeight: 600,
    color: '$grey600',
  },
})

const Wrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
})

const InputWrapper = styled('div', {
  fontFamily: '$mono',
  display: 'flex',
  position: 'relative',
})

const Cursor = styled(motion.span, {
  width: 4,
  aspectRatio: 1,
  background: '$grey600',
  borderRadius: '50%',
  position: 'absolute',
  top: '100%',
  left: '50%',
})

const InputCharacter = styled('p', {
  color: '$grey300',
  position: 'relative',
  variants: {
    type: {
      empty: {
        // TODO: Compute this based on font size and line height
        width: 12.3,
      },
    },
    active: {
      true: {
        color: '$black',
      },
    },
  },
})
