import React from "react";
import { motion } from "framer-motion";
import { Slider } from "~/components/Slider";
import { Visualizer, Content, Controls } from "~/components/Visualizer";
import { FullWidth } from "~/components/FullWidth";
import { styled } from "~/stitches.config";

export const HorizontalCurve = () => {
  const [weight, setWeight] = React.useState(10);
  const path = `M 10 20
Q 50 ${20 + weight} 90 20
L 90 60
Q 50 ${60 + weight} 10 60
Z`;
  return (
    <FullWidth>
      <Visualizer>
        <Content css={{ display: "flex" }}>
          <Pre>{path}</Pre>
          <svg viewBox="0 5 100 85">
            <Line x1={50} y1={0} x2={50} y2={90} secondary />
            <Line x1={10} y1={20} x2={50} y2={20 + weight} />
            <Line x1={90} y1={20} x2={50} y2={20 + weight} />
            <Line x1={10} y1={60} x2={50} y2={60 + weight} />
            <Line x1={90} y1={60} x2={50} y2={60 + weight} />
            <motion.path
              animate={{ d: path }}
              fill="none"
              stroke="var(--colors-gray12)"
              strokeWidth="1"
            />
            <ControlPoint y={19 + weight} />
            <ControlPoint y={59 + weight} />
            <Endpoint cx={10} cy={20} r="1" />
            <Endpoint cx={90} cy={20} r="1" />
            <Endpoint cx={90} cy={60} r="1" />
            <Endpoint cx={10} cy={60} r="1" />
          </svg>
        </Content>
        <Controls css={{ padding: "$6 $4" }}>
          <Slider
            min={0}
            max={20}
            value={[weight]}
            onValueChange={([w]) => setWeight(w)}
          />
        </Controls>
      </Visualizer>
    </FullWidth>
  );
};

const Pre = styled("pre", {
  flexBasis: 200,
  flexShrink: 0,
  fontFamily: "$mono",
  background: "$gray4",
  borderRight: "1px solid $gray8",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const ControlPoint = styled(motion.rect, {
  fill: "$blue9",
  width: 2,
  height: 2,
  x: 49,
});

const Endpoint = styled(motion.circle, {
  fill: "$gray4",
  stroke: "$gray12",
  strokeWidth: 0.5,
});

const Line = styled("line", {
  strokeWidth: 0.5,
  stroke: "$blue9",

  variants: {
    secondary: {
      true: {
        stroke: "$gray8",
        strokeDasharray: "1",
      },
    },
  },
});
