"use client";

import React from "react";
import { MDX } from "../components/mdx";
import { StateProvider } from "../components/state-context";
import { VisualWrapper } from "../components/visual-wrapper";
import { PracticeQuestion } from "../components/path-practice";
import * as syntax from "./content/syntax";
import * as curveGeneral from "./content/curve-general";
import * as chain from "./content/chain";
import * as pill from "./content/pill";
import { initialState } from "./state";

export function Content({ content, length }) {
  return (
    <StateProvider initial={initialState}>
      <MDX
        content={content}
        numSections={length}
        components={{
          ...pill.components,
          ...syntax.components,
          ...chain.components,
          ...curveGeneral.components,
          PracticeQuestion,
        }}
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
