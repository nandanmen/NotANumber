import { motion } from "framer-motion";

import { GridBackground } from "~/components/Grid";
import { AlgorithmControls } from "~/components/AlgorithmControls";

import { useAlgorithm } from "~/lib/algorithm";
import { darkTheme, styled } from "~/stitches.config";

import { CharacterList } from "../CharacterList";
import {
  tokenize,
  knownSingleCharacters,
  type Token,
  keywords,
} from "../lib/tokenize";
import { singleCharacter } from "../lib/single-character";

const algorithms = {
  tokenize,
  singleCharacter,
} as const;

type TokenizerState = {
  current: number;
  tokens: Token[];
  keywords: Set<string>;
  input: string;
  candidate?: Token;
  currentChar?: string;
  phase: string;
};

const INPUT = `function hello() {
  console.log('hello, world!')
}`;

export function Tokenizer({
  name = "tokenize",
  input = INPUT,
  showKnownTokens = true,
  showKeywords = true,
}) {
  const [state, ctx] = useAlgorithm<TokenizerState>(
    algorithms[name as keyof typeof algorithms],
    [input],
    { delay: 300 }
  );

  const isKeywordActive = (char: string) => {
    if (state.candidate && "name" in state.candidate) {
      return state.candidate.name === char;
    }
    return false;
  };

  return (
    <FigureWrapper>
      <AlgorithmControls context={ctx} />
      <GridBackground>
        <Wrapper>
          <Phase>{state.phase}</Phase>
          <CharacterList state={state} />
          {(showKnownTokens || showKeywords) && (
            <KnownCharsWrapper>
              {showKnownTokens && (
                <div>
                  <KnownCharsTitle>Known Tokens</KnownCharsTitle>
                  <KnownCharList>
                    {[...knownSingleCharacters.keys()].map((char) => (
                      <SingleChar
                        key={char}
                        active={state.currentChar === char}
                      >
                        {char}
                      </SingleChar>
                    ))}
                  </KnownCharList>
                </div>
              )}
              {showKeywords && (
                <div>
                  <KnownCharsTitle>Known Keywords</KnownCharsTitle>
                  <KnownCharList>
                    {[...keywords.keys()].map((char) => (
                      <SingleChar
                        key={char}
                        active={isKeywordActive(char)}
                        flex
                      >
                        {char}
                      </SingleChar>
                    ))}
                  </KnownCharList>
                </div>
              )}
            </KnownCharsWrapper>
          )}
          {state.tokens.length > 0 && (
            <TokenList>
              {state.tokens.map((token, index) => (
                <TokenBlock
                  key={index}
                  {...token}
                  animate={{ y: 0, opacity: 1 }}
                  initial={{ y: 8, opacity: 0 }}
                />
              ))}
            </TokenList>
          )}
        </Wrapper>
      </GridBackground>
    </FigureWrapper>
  );
}

const Phase = styled("h1", {
  color: "$grey600",
  fontWeight: 600,
});

const center = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const SingleChar = styled("li", {
  width: "$8",
  height: "$8",
  background: "$gray2",
  border: "1px solid $gray8",
  borderRadius: "$base",
  boxShadow: "$sm",
  fontSize: "0.75rem",
  ...center,

  variants: {
    active: {
      true: {
        background: "$gray12",
        border: "1px solid $gray12",
        color: "$gray1",

        [`.${darkTheme} &`]: {
          background: "$blue7",
          borderColor: "$blue10",
          color: "inherit",
        },
      },
    },
    flex: {
      true: {
        width: "fit-content",
        padding: "$0 $2",
      },
    },
  },
});

const FigureWrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$6",
});

function TokenBlock({ type, name = "", value = "", ...props }) {
  return (
    <TokenWrapper {...props}>
      <TokenType>{type}</TokenType>
      <TokenName>{name || value}</TokenName>
    </TokenWrapper>
  );
}

const TokenList = styled("ul", {
  listStyle: "none",
  "--cols": 2,

  display: "grid",
  gap: "$2",
  gridTemplateColumns: "repeat(var(--cols), 8rem)",

  "@md": {
    "--cols": 3,
  },
});

const TokenWrapper = styled(motion.li, {
  fontFamily: "$mono",
  fontSize: "$sm",
});

const TokenType = styled("p", {
  padding: "$1",
  marginLeft: "$2",
  background: "$gray4",
  fontSize: "0.75rem",
  width: "fit-content",
  border: "1px solid $gray8",
  borderTopLeftRadius: 4,
  borderTopRightRadius: 4,
  borderBottom: "none",
  transform: "translateY(3px)",
});

const TokenName = styled("p", {
  position: "relative",
  padding: "$2",
  background: "$gray1",
  border: "1px solid $gray8",
  boxShadow: "$sm",
  borderRadius: "$base",
  minHeight: 40,

  [`.${darkTheme} &`]: {
    background: "$gray2",
  },
});

const KnownCharsWrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$4",
});

const KnownCharsTitle = styled("p", {
  color: "$gray11",
  fontSize: "$sm",
  marginBottom: "$1",
});

const KnownCharList = styled("ul", {
  display: "flex",
  fontFamily: "$mono",
  gap: "$1",
});

const Wrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "$16",
  position: "relative",
  padding: "$12 0",
});
