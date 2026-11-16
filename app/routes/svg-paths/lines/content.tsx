/* eslint-disable react/jsx-key */
"use client";

import React from "react";
import { StateProvider } from "../components/state-context";
import { PathHoverVisual } from "../components/path-hover-visual";
import { AbsoluteLine, RelativeLine, ZExample, HeartPath, Heart } from "./components";
import { PracticeQuestion } from "../components/path-practice";
import { initialState } from "./state";
import { VisualWrapper } from "../components/visual-wrapper";
import { ContentWrapper } from "../components/content-wrapper";

export function LinesContent({ children, length }) {
  return (
    <StateProvider initial={initialState}>
      <ContentWrapper
        content={children}
        numSections={length}
      >
        <VisualWrapper
          components={[
            {
              svg: 20,
              children: <AbsoluteLine />,
            },
            {
              children: (
                <>
                  <AbsoluteLine placeholder />
                  <RelativeLine />
                </>
              ),
            },
            {
              svg: 20,
              children: <PathHoverVisual source="vertical" />,
            },
            {
              svg: 20,
              children: <ZExample />,
            },
            {
              svg: 24,
              children: <HeartPath />,
            },
            {
              svg: {
                size: 10,
                config: { pan: { x: 7, y: 3 } },
              },
              children: <Heart />,
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