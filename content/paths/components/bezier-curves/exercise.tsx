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

const commands = `
M 10 10
v 15
h 15
v -15
h -15
M 10.0 21.5
q 5 -7.5 10 0
M 15.0 17.5
q 5 -7.5 10 0
`;

export const Exercise = () => {
  return (
    <PathProvider commands={[]}>
      <Path
        large
        d={commands}
        transition={{ pathLength: { duration: 2 } }}
        css={{ stroke: "$gray8" }}
      />
    </PathProvider>
  );
};
