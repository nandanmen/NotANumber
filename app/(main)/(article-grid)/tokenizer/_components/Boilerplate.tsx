"use client";

import { GridBackground } from "~/components/Grid";
import { PlayButton } from "~/components/PlayButton";
import { useAlgorithm } from "~/lib/algorithm";
import snapshot from "~/lib/algorithm/snapshot.macro";

import { CharacterList } from "./CharacterList";
import type { Token } from "./lib/tokenize";

const boilerplate = snapshot(function tokenize(input: string) {
  let current = 0;
  const tokens: Token[] = [];

  while (current < input.length) {
    // parse tokens
    debugger;
    current++;
  }

  debugger;
  return tokens;
});

const input = `function hello() {
  console.log('hello, world!')
}`;

type BoilerplateState = {
  input: string;
  current: number;
  tokens: Token[];
};

export function Boilerplate() {
  const [state, ctx] = useAlgorithm<BoilerplateState>(boilerplate, [input], {
    delay: 200,
  });
  return (
    <GridBackground>
      <div className="flex flex-col items-center justify-center py-12">
        <CharacterList state={state} />
      </div>
      <div className="absolute bottom-2 left-2">
        <PlayButton isPlaying={ctx.isPlaying} onClick={ctx.toggle} secondary />
      </div>
    </GridBackground>
  );
}
