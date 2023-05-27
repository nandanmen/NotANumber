"use client";

import React from "react";
import { MDX } from "../components/mdx";
import { StateProvider } from "../components/state-context";
import { ActiveComponent, VisualWrapper } from "../components/visual-wrapper";
import * as syntax from "./content/syntax";
import { CommandListFromSource } from "./command-list";
import { createPath, parsePath } from "app/svg-paths/lib/path";

const parsed = parsePath("M 5 5 A 10.0 7.5 0.0 0 1 20.0 15.0");
const slice = createPath(parsed.commands.slice(1));
const arc = slice.at(0);

export function Content({ content, length }) {
  return (
    <StateProvider
      initial={{
        syntax: syntax.initialState,
        ellipse: {
          path: slice,
          active: [
            `${arc.id}.rx`,
            `${arc.id}.ry`,
            `${arc.id}.x`,
            `${arc.id}.y`,
          ],
        },
        rotation: {
          path: slice,
          active: [`${arc.id}.xAxisRotation`],
        },
        flags: {
          path: slice,
          active: [`${arc.id}.largeArc`, `${arc.id}.sweep`],
        },
      }}
    >
      <MDX
        content={content}
        numSections={length}
        components={{ CommandListFromSource }}
      >
        <ActiveComponent components={[syntax.page]} />
        <VisualWrapper components={[null]} />
      </MDX>
    </StateProvider>
  );
}
