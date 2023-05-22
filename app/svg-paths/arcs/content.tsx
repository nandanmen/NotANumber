"use client";

import React from "react";
import { MDX } from "../components/mdx";
import { StateProvider } from "../components/state-context";
import { VisualWrapper } from "../components/visual-wrapper";
import * as syntax from "./content/syntax";
import { CommandListFromSource } from "./command-list";

export function Content({ content, length }) {
  return (
    <StateProvider
      initial={{
        syntax: syntax.initialState,
      }}
    >
      <MDX
        content={content}
        numSections={length}
        components={{ CommandListFromSource }}
      >
        <VisualWrapper components={[syntax.page]} />
      </MDX>
    </StateProvider>
  );
}
