import React from "react";
import { Text } from "~/components/PathPlayground";
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
    <AnimatableLine
      x1="0"
      y1="0"
      x2="10"
      y2="20"
      transition={{ duration: 1, delay: 0.5 }}
    />
    <Endpoint cx="0" cy="0" shadow />
    <Endpoint
      animate={{ cx: 10, cy: 20 }}
      initial={{ cx: 0, cy: 0 }}
      transition={{ duration: 1, delay: 0.5 }}
    />
  </>,
  <>
    <AnimatableLine x1="0" y1="0" x2="10" y2="20" />
    <AnimatableLine x1="10" y1="20" x2="20" y2="12.5" />
    <Line x1="10" y1="12.5" x2="20" y2="12.5" css={{ stroke: "$gray8" }} />
    <Line x1="10" y1="12.5" x2="10" y2="20" css={{ stroke: "$gray8" }} />
    <Endpoint cx="0" cy="0" />
    <Endpoint animate={{ cx: 10, cy: 20 }} />
    <Endpoint animate={{ cx: 20, cy: 12.5 }} initial={{ cx: 10, cy: 20 }} />
    <Text fontWeight="bold" large x={10.5} y={16} dominantBaseline="middle">
      -7.5
    </Text>
    <Text fontWeight="bold" large x={15} y={12} textAnchor="middle">
      10
    </Text>
    <Endpoint small cx="10" cy="12.5" css={{ stroke: "none" }} />
  </>,
];

export const MoveCommand = ({ index }) => {
  return <PathProvider commands={[]}>{views[index] ?? null}</PathProvider>;
};
