"use client";

import { type HTMLMotionProps, motion } from "framer-motion";

import { AlgorithmControls } from "~/components/AlgorithmControls";
import { GridBackground } from "~/components/Grid";
import { useAlgorithm } from "~/lib/algorithm";
import { cn } from "~/lib/cn";

import { CharacterList } from "./CharacterList";
import { singleCharacter } from "./lib/single-character";
import {
  type Token,
  type TokenType,
  keywords,
  knownSingleCharacters,
  tokenize,
} from "./lib/tokenize";

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
}: {
  name?: keyof typeof algorithms;
  input?: string;
  showKnownTokens?: boolean;
  showKeywords?: boolean;
}) {
  const [state, ctx] = useAlgorithm<TokenizerState>(algorithms[name], [input], {
    delay: 300,
  });

  const isKeywordActive = (char: string) => {
    if (state.candidate && "name" in state.candidate) {
      return state.candidate.name === char;
    }
    return false;
  };

  return (
    <div className="flex flex-col gap-6">
      <AlgorithmControls context={ctx} />
      <GridBackground>
        <div className="relative flex flex-col items-center justify-center gap-16 py-12">
          <h1 className="text-base font-semibold text-gray11">{state.phase}</h1>
          <CharacterList state={state} />
          {(showKnownTokens || showKeywords) && (
            <div className="flex flex-col gap-4">
              {showKnownTokens && (
                <div>
                  <p className="mb-1 text-sm text-gray11">Known Tokens</p>
                  <ul className="flex gap-1 font-mono">
                    {[...knownSingleCharacters.keys()].map((char) => (
                      <li
                        key={char}
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-md border border-gray8 bg-gray2 text-xs shadow-sm",
                          state.currentChar === char &&
                            "border-gray12 bg-gray12 text-gray1",
                        )}
                      >
                        {char}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {showKeywords && (
                <div>
                  <p className="mb-1 text-sm text-gray11">Known Keywords</p>
                  <ul className="flex gap-1 font-mono">
                    {[...keywords.keys()].map((char) => (
                      <li
                        key={char}
                        className={cn(
                          "flex h-8 min-w-8 items-center justify-center rounded-md border border-gray8 bg-gray2 px-2 text-xs shadow-sm",
                          isKeywordActive(char) &&
                            "border-gray12 bg-gray12 text-gray1",
                        )}
                      >
                        {char}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          {state.tokens.length > 0 && (
            <ul className="grid list-none gap-2 [grid-template-columns:repeat(2,8rem)] md:[grid-template-columns:repeat(3,8rem)]">
              {state.tokens.map((token, index) => (
                <TokenBlock
                  // biome-ignore lint/suspicious/noArrayIndexKey: token list grows monotonically in the viz; index matches animation frame
                  key={index}
                  {...token}
                  animate={{ y: 0, opacity: 1 }}
                  initial={{ y: 8, opacity: 0 }}
                />
              ))}
            </ul>
          )}
        </div>
      </GridBackground>
    </div>
  );
}

type TokenBlockProps = {
  type: TokenType;
  name?: string;
  value?: string;
} & HTMLMotionProps<"li">;

function TokenBlock({
  type,
  name = "",
  value = "",
  ...props
}: TokenBlockProps) {
  return (
    <motion.li className="font-mono text-sm" {...props}>
      <p className="mb-[-1px] ml-2 w-fit translate-y-[3px] border border-b-0 border-gray8 bg-gray4 p-1 text-xs [border-radius:4px_4px_0_0]">
        {type}
      </p>
      <p className="relative min-h-10 rounded-md border border-gray8 bg-gray1 p-2 shadow-sm">
        {name || value}
      </p>
    </motion.li>
  );
}
