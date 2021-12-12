import { motion } from 'framer-motion'

import { AnimationWrapper } from '@/components/AlgorithmPlayer'
import { useAlgorithmSteps } from '@/lib/hooks/useAlgorithmSteps'
import { styled } from '@/stitches'

import { tokenize } from './lib/tokenizer'

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

export function Tokenizer() {
  const player = useAlgorithmSteps<TokenizerState>({
    algorithm: tokenize,
    inputs: [INPUT],
    options: {
      delay: 300,
    },
  })
  const { state } = player.models
  const codeInput = [...state.input]

  return (
    <AnimationWrapper player={player} controls editable={false}>
      <Wrapper>
        <InputWrapper>
          {codeInput.map((char, index) => {
            const isActive = index <= state.current && index >= state.start
            return (
              <InputCharacter
                key={index}
                type={char === ' ' ? 'empty' : undefined}
                active={isActive}
              >
                {char === '\n' ? `\\n` : char}
                {isActive && <Cursor style={{ x: '-50%' }} />}
              </InputCharacter>
            )
          })}
        </InputWrapper>
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
      </Wrapper>
    </AnimationWrapper>
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
  fontSize: '$lg',
  display: 'flex',
  position: 'relative',
})

const Cursor = styled(motion.span, {
  width: 8,
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
