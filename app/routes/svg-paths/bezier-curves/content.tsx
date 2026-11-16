"use client";

import React from "react";
import { StateProvider } from "../components/state-context";
import { VisualWrapper } from "../components/visual-wrapper";
import { PracticeQuestion } from "../components/path-practice";
import { initialState } from "./state";
import { ContentWrapper } from "../components/content-wrapper";
import { Chain, CurvePlayground, CurveTypes, RoundedCorner } from "./components";

export function Content({ children, length }) {
  return (
    <StateProvider initial={initialState}>
      <ContentWrapper
        content={children}
        numSections={length}
      >
        <VisualWrapper
          components={[
            {
              children: <CurveTypes />,
              svg: 20,
            },
            {
              children: <CurvePlayground />,
              svg: 20,
            },
            {
              children: <RoundedCorner />,
              svg: 20,
            },
            {
              children: <Chain />,
              svg: 20,
            },
            {
              children: <PracticeQuestion />,
            },
          ]}
        />
      </ContentWrapper>
    </StateProvider>
  );
}
