import { motion } from 'framer-motion'

import { Algorithm, AlgorithmContext } from '@/components/AlgorithmPlayer'
import { styled } from '@/stitches'

import { CharacterList } from './CharacterList'
import { tokenize, knownSingleCharacters, Token } from './lib/tokenize'
import { singleCharacter } from './lib/single-character'

const algorithms = {
  tokenize,
  singleCharacter,
}

type TokenizerState = {
  current: number
  tokens: Token[]
  keywords: Set<string>
  input: string
  candidate?: Token
  currentChar?: string
}

const INPUT = `function hello() {
  console.log('hello, world!')
}`

export function Tokenizer({
  name = 'tokenize',
  input = INPUT,
  showKnownTokens = true,
}) {
  return (
    <Algorithm
      algorithm={algorithms[name]}
      initialInputs={[input]}
      delay={300}
      controls
      editable
    >
      {(context: AlgorithmContext<TokenizerState>) => (
        <Wrapper>
          <CharacterList state={context.state} />
          <KnownCharsWrapper>
            {showKnownTokens && (
              <>
                <KnownCharsTitle>Known Tokens</KnownCharsTitle>
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
              </>
            )}
          </KnownCharsWrapper>
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

function TokenBlock({ type, name = '', value = '', ...props }) {
  return (
    <TokenWrapper {...props}>
      <TokenType>{type}</TokenType>
      <TokenName>{name || value}</TokenName>
    </TokenWrapper>
  )
}

const TokenList = styled('ul', {
  display: 'grid',
  gap: '$2',
  gridTemplateColumns: 'repeat(3, 8rem)',
  marginTop: '$16',
})

const TokenWrapper = styled(motion.li, {
  fontFamily: '$mono',
  fontSize: '$sm',
})

const TokenType = styled('p', {
  padding: '$1',
  marginLeft: '$2',
  background: '$grey100',
  fontSize: '0.75rem',
  width: 'fit-content',
  border: '1px solid $grey300',
  borderTopLeftRadius: 4,
  borderTopRightRadius: 4,
  borderBottom: 'none',
  transform: 'translateY(3px)',
})

const TokenName = styled('p', {
  position: 'relative',
  padding: '$2',
  background: '$white',
  border: '1px solid $grey300',
  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  borderRadius: 6,
  minHeight: 40,
})

const KnownCharsWrapper = styled('div', {
  marginTop: '$16',
})

const KnownCharsTitle = styled('p', {
  color: '$grey600',
  fontSize: '$sm',
  marginBottom: '$2',
})

const KnownCharList = styled('ul', {
  display: 'flex',
  justifyContent: 'center',
  fontFamily: '$mono',
  gap: '$1',
})

const Wrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
})
