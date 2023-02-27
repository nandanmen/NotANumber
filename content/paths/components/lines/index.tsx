import React from "react";
import {
  parse,
  PathProvider,
  PathSections,
  Endpoint,
  getCursorAtIndex,
  Lines,
  Endpoints,
  Path,
} from "~/components/PathVisualizer";
import { PathBackground } from "~/components/PathPlayground";
import { usePageContext } from "../PageProvider";

export const LinesVisual = () => {
  return (
    <PathBackground size={30} step={5}>
      <PathProvider commands={[]}>
        <Path
          d="M 7.5 10 l 2.5 -5 h 10 l 2.5 5 h -12.5 v 10 h 5 v -5 h -2.5 v 5 h 7.5 v -10 z"
          transition={{ pathLength: { duration: 2 } }}
          css={{ stroke: "$gray8" }}
        />
      </PathProvider>
    </PathBackground>
  );
};
