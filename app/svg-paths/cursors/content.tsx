"use client";

import { MDX } from "../components/mdx";
import { Cursors, CursorOverview } from "./cursors";
import { StateProvider } from "../components/state-context";
import { initialState } from "./state";

export function CursorsContent({ content, length }) {
  return (
    <StateProvider initial={initialState}>
      <MDX
        content={content}
        numSections={length}
        components={{ CursorOverview }}
      >
        <Cursors />
      </MDX>
    </StateProvider>
  );
}
