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
    <PathProvider commands={[]} size={25}>
      {positions.map(({ cx, cy }, index) => {
        return (
          <AnimatedEndpoint
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

const AnimatedEndpoint = ({ cx, cy, delay }) => {
  const { endpointSize, padding } = useBackgroundContext();
  const id = React.useId();
  return (
    <>
      <mask id={id}>
        <rect
          x={-padding}
          y={-padding}
          width="100%"
          height="100%"
          fill="white"
        />
        <motion.circle
          cx={cx}
          cy={cy}
          r={endpointSize * 1.25}
          animate={{ r: endpointSize * 7 }}
          transition={{ type: "spring", damping: 20, delay }}
          initial={{ r: endpointSize * 1.25 }}
          fill="black"
        />
      </mask>
      <Shadow
        cx={cx}
        cy={cy}
        r={endpointSize * 6}
        mask={`url('#${id}')`}
        animate="shown"
        initial="hidden"
        variants={{
          hidden: { scale: 0.5, opacity: 0 },
          shown: { scale: 1, opacity: 1 },
        }}
        transition={{ type: "spring", damping: 10, stiffness: 150, delay }}
      />
      <Endpoint
        cx={cx}
        cy={cy}
        animate="shown"
        initial="hidden"
        variants={{
          hidden: { scale: 0.5, opacity: 0 },
          shown: { scale: 1, opacity: 1 },
        }}
        transition={{ type: "spring", damping: 10, stiffness: 150, delay }}
      />
    </>
  );
};

const Shadow = styled(motion.circle, {
  fill: "$gray2",
});
