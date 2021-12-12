import { AnimationWrapper } from '@/components/AlgorithmPlayer'
import { useAlgorithmSteps } from '@/lib/hooks/useAlgorithmSteps'
import { styled } from '@/stitches'

import { tokenize } from './lib/tokenizer'

const INPUT = `function hello(message) {
  console.log(message);
}`

type Token = {
  type: string
  name?: string
}

type TokenizerState = {
  input: string
  start: number
  current: number
  tokens: Token[]
}

export function Tokenizer() {
  const player = useAlgorithmSteps<TokenizerState>({
    algorithm: tokenize,
    inputs: [INPUT],
    options: {
      delay: 250,
    },
  })
  const { state } = player.models
  const codeInput = [...state.input]

  return (
    <AnimationWrapper player={player} controls editable>
      <InputWrapper>
        {codeInput.map((char, index) => (
          <InputCharacter
            key={index}
            type={char === ' ' ? 'empty' : undefined}
            active={index <= state.current && index >= state.start}
          >
            {char === '\n' ? `\\n` : char}
          </InputCharacter>
        ))}
      </InputWrapper>
    </AnimationWrapper>
  )
}

const InputWrapper = styled('div', {
  fontFamily: '$mono',
  fontSize: '$lg',
  display: 'flex',
  justifyContent: 'center',
})

const InputCharacter = styled('p', {
  color: '$grey300',
  variants: {
    type: {
      empty: {
        width: '0.75em',
      },
    },
    active: {
      true: {
        color: '$black',
      },
    },
  },
})
