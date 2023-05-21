"use client";

import React from "react";
import { MDX } from "../components/mdx";
import { StateProvider } from "../components/state-context";
import { VisualWrapper } from "../components/visual-wrapper";
import * as syntax from "./content/syntax";

export function Content({ content, length }) {
  return (
    <StateProvider
      initial={{
        syntax: syntax.initialState,
      }}
    >
      <MDX content={content} numSections={length}>
        <VisualWrapper components={[syntax.page]} />
      </MDX>
    </StateProvider>
  );
}
