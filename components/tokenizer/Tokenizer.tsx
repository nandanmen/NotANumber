import { motion } from 'framer-motion'

import { Algorithm, AlgorithmContext } from '@/components/AlgorithmPlayer'
import { styled } from '@/stitches'

import { CharacterList } from './CharacterList'
import { tokenize, knownSingleCharacters, Token } from './lib/tokenize'

type TokenizerState = {
  current: number
  tokens: Token[]
  keywords: Set<string>
  input: string
  candidate?: Token
  currentChar?: string
}

export function Tokenizer() {
  return (
    <Algorithm
      algorithm={tokenize}
      initialInputs={['console.log(message)']}
      delay={300}
      controls
      editable
    >
      {(context: AlgorithmContext<TokenizerState>) => (
        <Wrapper>
          <CharacterList state={context.state} />
          <KnownCharList>
            {[...knownSingleCharacters.keys()].map((char) => (
              <SingleChar
                key={char}
                active={context.state.currentChar === char}
              >
                {char}
              </SingleChar>
            ))}
          </KnownCharList>
          <TokenList>
            {context.state.tokens.map((token, index) => (
              <TokenBlock
                key={index}
                {...token}
                animate={{ y: 0, opacity: 1 }}
                initial={{ y: 8, opacity: 0 }}
              />
            ))}
          </TokenList>
        </Wrapper>
      )}
    </Algorithm>
  )
}

const center = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}

const SingleChar = styled('li', {
  width: '$8',
  height: '$8',
  background: '$grey100',
  border: '1px solid $grey300',
  borderRadius: 6,
  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  fontSize: '0.75rem',
  ...center,

  variants: {
    active: {
      true: {
        background: '$black',
        border: '1px solid $black',
        color: '$white',
      },
    },
  },
})

function TokenBlock({ type, name, ...props }) {
  return (
    <TokenWrapper {...props}>
      <TokenType>{type}</TokenType>
      <TokenName>{name}</TokenName>
    </TokenWrapper>
  )
}

const TokenList = styled('ul', {
  display: 'grid',
  gap: '$2',
  gridTemplateColumns: 'repeat(3, 12rem)',
  marginTop: '$16',
})

const TokenWrapper = styled(motion.li, {
  display: 'flex',
  fontFamily: '$mono',
  fontSize: '$sm',
  border: '1px solid $grey300',
  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  borderRadius: 6,
})

const TokenType = styled('p', {
  flex: 1,
  flexShrink: 0,
  padding: '$2',
  background: '$grey100',
  borderRight: '1px solid $grey300',
  borderTopLeftRadius: 6,
  borderBottomLeftRadius: 6,
})

const TokenName = styled('p', {
  flex: 1,
  flexShrink: 0,
  padding: '$2',
  background: '$white',
  borderTopRightRadius: 6,
  borderBottomRightRadius: 6,
})

const KnownCharList = styled('ul', {
  display: 'flex',
  justifyContent: 'center',
  fontFamily: '$mono',
  marginTop: '$16',
  gap: '$1',
})

const Wrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
})
