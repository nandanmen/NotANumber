"use client";

import React from "react";
import { MDX } from "../components/mdx";
import { StateProvider } from "../components/state-context";
import { VisualWrapper } from "../components/visual-wrapper";
import { SyntaxExample } from "./components/syntax-example";
import { ChainExample } from "./components/chain-example";
import {
  getInitialPracticeQuestionState,
  PracticeQuestion,
} from "../components/path-practice";
import * as syntax from "./content/syntax";
import * as curveGeneral from "./content/curve-general";
import * as chain from "./content/chain";
import * as pill from "./content/pill";

export function Content({ content, length }) {
  return (
    <StateProvider
      initial={{
        syntax: syntax.initialState,
        chainDrag: chain.initialState,
        ...getInitialPracticeQuestionState([
          "M 10 18",
          "c -10 -1 -10 -14 0 -15",
          "q 6 -0.75 8 5",
          "c 7 0 7 10 0 10",
          "m -1.0 -2",
          "v 6",
          "m -2.0 -4.5",
          "v 6",
          "m -2.0 -6",
          "v 6",
          "m -2.0 -7.5",
          "v 6",
        ]),
      }}
    >
      <MDX
        content={content}
        numSections={length}
        components={{ SyntaxExample, ChainExample }}
      >
        <VisualWrapper
          components={[
            ...pill.pages,
            syntax.page,
            curveGeneral.page,
            chain.page,
            {
              children: <PracticeQuestion />,
              svg: 25,
            },
          ]}
        />
      </MDX>
    </StateProvider>
  );
}
