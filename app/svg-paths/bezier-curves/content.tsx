"use client";

import { MDX } from "../components/mdx";
import { Path } from "../components/path";
import { PathVisualizer } from "../components/path-visualizer";
import { StateProvider } from "../components/state-context";
import { CoordinatesTooltip } from "../components/svg/tooltip";
import { VisualWrapper } from "../components/visual-wrapper";

export function Content({ content, length }) {
  return (
    <StateProvider initial={{}}>
      <MDX content={content} numSections={length}>
        <VisualWrapper
          components={[
            null,
            null,
            {
              children: (
                <>
                  <PathVisualizer path="M 5 0 v 5 Q 5 15 15 15 h 5" />
                  <CoordinatesTooltip x={5} y={15} placement="bottom" />
                  <CoordinatesTooltip x={15} y={15} placement="bottom" />
                </>
              ),
              svg: 20,
            },
          ]}
        />
      </MDX>
    </StateProvider>
  );
}
