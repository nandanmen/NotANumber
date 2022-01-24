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
        <>
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
          <Wrapper>
            <CharacterList state={context.state} />
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
        </>
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
  width: '$10',
  height: '$10',
  background: '$white',
  border: '1px solid $black',
  ...center,

  '&:not(:last-child)': {
    borderRight: 'none',
  },

  variants: {
    active: {
      true: {
        background: '$black',
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
  gap: 4,
  gridTemplateColumns: 'repeat(3, 12rem)',
  marginTop: '$16',
})

const TokenWrapper = styled(motion.li, {
  display: 'flex',
  fontFamily: '$mono',
  fontSize: '$sm',
  border: '1px solid $black',
})

const TokenType = styled('p', {
  flex: 1,
  flexShrink: 0,
  padding: '$2',
  background: '$teal',
  borderRight: '1px solid $black',
})

const TokenName = styled('p', {
  flex: 1,
  flexShrink: 0,
  padding: '$2',
  background: '$white',
})

const KnownCharList = styled('ul', {
  display: 'flex',
  justifyContent: 'center',
  fontFamily: '$mono',
  marginBottom: '$16',
})

const Wrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
})