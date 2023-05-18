"use client";

import React from "react";
import { MDX } from "../components/mdx";
import { StateProvider, useStateContext } from "../components/state-context";
import { VisualWrapper } from "../components/visual-wrapper";

export function Content({ content, length }) {
  return (
    <StateProvider initial={{}}>
      <MDX content={content} numSections={length}>
        <VisualWrapper components={[]} />
      </MDX>
    </StateProvider>
  );
}
