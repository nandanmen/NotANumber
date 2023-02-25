import React from "react";
import {
  parse,
  PathProvider,
  PathSections,
  Lines,
  Line,
  AnimatableLine,
  Endpoint,
  Endpoints,
  getCursorAtIndex,
} from "~/components/PathVisualizer";

const views = [
  <>
    <AnimatableLine x1="0" y1="0" x2="10" y2="20" />
    <Line x1="10" y1="12.5" x2="20" y2="12.5" css={{ stroke: "$gray8" }} />
    <Line x1="10" y1="12.5" x2="10" y2="20" css={{ stroke: "$gray8" }} />
    <Endpoint cx="0" cy="0" />
    <Endpoint animate={{ cx: 10, cy: 20 }} initial={{ cx: 0, cy: 0 }} />
    <Endpoint small cx="10" cy="12.5" css={{ stroke: "none" }} />
  </>,
  <>
    <AnimatableLine x1="0" y1="0" x2="10" y2="20" />
    <AnimatableLine x1="10" y1="20" x2="20" y2="12.5" />
    <Line x1="10" y1="12.5" x2="20" y2="12.5" css={{ stroke: "$gray8" }} />
    <Line x1="10" y1="12.5" x2="10" y2="20" css={{ stroke: "$gray8" }} />
    <Endpoint cx="0" cy="0" />
    <Endpoint animate={{ cx: 10, cy: 20 }} />
    <Endpoint animate={{ cx: 20, cy: 12.5 }} initial={{ cx: 10, cy: 20 }} />
    <Endpoint small cx="10" cy="12.5" css={{ stroke: "none" }} />
  </>,
];

export const MoveCommand = ({ index }) => {
  return (
    <PathProvider commands={[]} size={25}>
      {views[index] ?? null}
    </PathProvider>
  );
};
