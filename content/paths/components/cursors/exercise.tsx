import React from "react";
import { motion } from "framer-motion";
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
import { styled } from "~/stitches.config";
import { useBackgroundContext } from "~/components/PathPlayground";

const positions = [
  { cx: 0, cy: 5 },
  { cx: 5, cy: 15 },
  { cx: 15, cy: 15 },
  { cx: 20, cy: 20 },
  { cx: 25, cy: 10 },
];

export const Exercise = () => {
  return (
    <PathProvider commands={[]}>
      {positions.map(({ cx, cy }, index) => {
        return (
          <Endpoint
            shadow
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            delay={index * 0.25}
          />
        );
      })}
    </PathProvider>
  );
};
