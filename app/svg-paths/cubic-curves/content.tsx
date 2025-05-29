"use client";

import React from "react";
import { StateProvider } from "../components/state-context";
import { VisualWrapper } from "../components/visual-wrapper";
import { PracticeQuestion } from "../components/path-practice";
import * as syntax from "./content/syntax";
import * as curveGeneral from "./content/curve-general";
import * as chain from "./content/chain";
import * as pill from "./content/pill";
import { initialState } from "./state";
import { ContentWrapper } from "../components/content-wrapper";

export function Content({ children, length }) {
  return (
    <StateProvider initial={initialState}>
      <ContentWrapper
        content={children}
        numSections={length}
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
      </ContentWrapper>
    </StateProvider>
  );
}
