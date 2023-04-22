"use client";

import { MDX } from "../components/mdx";
import { Cursors } from "./cursors";
import { StateProvider } from "../components/state-context";

export function CursorsContent({ content, length }) {
  return (
    <StateProvider
      initial={{
        absolute: { x: 5, y: 5 },
        relative: { x: 15, y: 5 },
      }}
    >
      <MDX content={content} numSections={length}>
        <Cursors />
      </MDX>
    </StateProvider>
  );
}
