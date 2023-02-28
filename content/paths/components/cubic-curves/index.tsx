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
import { InteractivePathPlayground } from "~/components/InteractivePathPlayground";

const trophy = `
M 9.0 5.0
c 0 10 3 5 3 13
l -1 2
h 3
l -1 -2
c 0 -8 3 -3 3 -13
q -3.5 2 -7 0
`;

const badPill = "M 8.5 10.0 h 8 q 5 2.5 0 5 h -8 q -5 -2.5 0 -5";

const goodPill = "M 8.5 10.0 h 8 c 5 0 5 5 0 5 h -8 c -5 0 -5 -5 0 -5";

const mapCommandToIndex = [badPill, goodPill, trophy];

export const CubicCurvesVisual = () => {
  const { activeIndex } = usePageContext();
  return (
    <InteractivePathPlayground
      size={25}
      step={5}
      commands={mapCommandToIndex[activeIndex] ?? badPill}
      autoplay
    />
  );
};
