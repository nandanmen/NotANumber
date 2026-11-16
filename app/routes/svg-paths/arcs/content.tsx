"use client";

import React from "react";
import { StateProvider } from "../components/state-context";
import { VisualWrapper } from "../components/visual-wrapper";
import * as syntax from "./content/syntax";
import * as ellipse from "./content/ellipse";
import * as smallEllipse from "./content/small-ellipse";
import * as rotation from "./content/rotation";
import * as flags from "./content/flags";
import { PracticeQuestion } from "../components/path-practice";
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
            syntax.page,
            ellipse.page,
            smallEllipse.page,
            rotation.page,
            flags.page,
            flags.page,
            flags.page,
            flags.page,
            flags.page,
            syntax.page,
            {
              children: <PracticeQuestion />,
            },
          ]}
        />
      </ContentWrapper>
    </StateProvider>
  );
}
