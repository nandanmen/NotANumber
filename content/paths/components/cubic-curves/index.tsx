import React from "react";
import {
  parse,
  PathVisualizer,
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

const rain = `M 10 20
c -10 -1 -10 -14 0 -15
q 6 -1 8 5
c 7 0 7 10 0 10
m -1.0 -2
v 6
m -2.0 -4.5
v 6
m -2.0 -6
v 6
m -2.0 -7.5
v 6
`;

export const CubicCurvesVisual = () => {
  const { activeIndex } = usePageContext();
  if (activeIndex < 3) {
    return (
      <InteractivePathPlayground
        size={25}
        step={5}
        commands={mapCommandToIndex[activeIndex] ?? badPill}
        autoplay
      />
    );
  }
  if (activeIndex === 3) {
    return (
      <PathBackground size={30} step={5}>
        <PathVisualizer commands={parse("M 5 15 C 10 25 20 5 25 15")} />
      </PathBackground>
    );
  }
  if (activeIndex === 4) {
    return (
      <PathBackground size={30} step={5}>
        <path
          d="M 0 15 c 5 10 10 -10 15 0 s 10 -10 15 0"
          fill="none"
          stroke="white"
        />
      </PathBackground>
    );
  }
  return (
    <PathBackground size={30} step={5}>
      <Path
        large
        d={rain}
        css={{ stroke: "$gray8" }}
        transition={{ duration: 2 }}
      />
      {activeIndex === 6 && <PathVisualizer commands={parse(rain)} />}
    </PathBackground>
  );
};
