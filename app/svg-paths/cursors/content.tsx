"use client";

import { MDX } from "../components/mdx";
import { Cursors } from "./cursors";
import { StateProvider } from "./state-context";
import { InteractiveCommand } from "./interactive-command";

export function CursorsContent({ content, length }) {
  return (
    <StateProvider
      initial={{
        absolute: { x: 5, y: 5 },
        relative: { x: 15, y: 5 },
      }}
    >
      <MDX
        content={content}
        numSections={length}
        components={{ InteractiveCommand }}
      >
        <Cursors />
      </MDX>
    </StateProvider>
  );
}
