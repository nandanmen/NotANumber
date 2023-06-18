"use client";

import { MDX } from "../components/mdx";
import { Cursors, CursorOverview, Practice, Corner } from "./cursors";
import { StateProvider } from "../components/state-context";
import { initialState } from "./state";

export function CursorsContent({ content, length }) {
  return (
    <StateProvider initial={initialState}>
      <MDX
        content={content}
        numSections={length}
        components={{ CursorOverview, Practice, Corner }}
      >
        <Cursors />
      </MDX>
    </StateProvider>
  );
}
