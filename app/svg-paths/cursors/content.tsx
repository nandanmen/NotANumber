"use client";

import { MDX } from "../components/mdx";
import { Cursors } from "./cursors";
import { StateProvider } from "../components/state-context";
import { getInitialPracticeQuestionState } from "../components/path-practice";

export function CursorsContent({ content, length }) {
  return (
    <StateProvider
      initial={{
        absolute: { x: 5, y: 5 },
        relative: { x: 15, y: 5 },
        ...getInitialPracticeQuestionState([
          "M 0 5",
          "m 5 10",
          "m 5 -5",
          "m 5 0",
          "m 5 -10",
        ]),
      }}
    >
      <MDX content={content} numSections={length}>
        <Cursors />
      </MDX>
    </StateProvider>
  );
}
