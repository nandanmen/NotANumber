import { useAlgorithm } from "~/lib/algorithm";
import { styled } from "~/stitches.config";
import snapshot from "~/lib/algorithm/snapshot.macro";
import { GridBackground } from "~/components/Grid";

import type { Token } from "./lib/tokenize";
import { CharacterList } from "./CharacterList";

const boilerplate = snapshot(function tokenize(input: string) {
  let current = 0;
  let tokens: Token[] = [];

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
  const [state] = useAlgorithm<BoilerplateState>(boilerplate, [input]);
  return (
    <GridBackground>
      <Wrapper>
        <CharacterList state={state} />
      </Wrapper>
    </GridBackground>
  );
}

const Wrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "$12 0",
});
