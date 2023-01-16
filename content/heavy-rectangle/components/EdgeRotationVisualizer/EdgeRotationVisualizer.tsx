import React from "react";
import { motion } from "framer-motion";
import { Slider } from "~/components/Slider";
import { Visualizer, Content, Controls } from "~/components/Visualizer";
import { FullWidth } from "~/components/FullWidth";
import { styled } from "~/stitches.config";

const HEIGHT = 40;

const getEndpoint = (weight: number) => {
  const width = 40;
  const angle = Math.atan(weight / width);
  return {
    x: Math.sin(angle) * HEIGHT,
    y: Math.cos(angle) * HEIGHT,
  };
};

export const EdgeRotationVisualizer = () => {
  const [weight, setWeight] = React.useState(10);
  const endpoint = getEndpoint(weight);
  const path = `M 10 20
Q 50 ${20 + weight} 90 20
l ${endpoint.x} ${endpoint.y}`;
  return (
    <FullWidth>
      <Visualizer>
        <Content css={{ display: "flex" }}>
          <svg viewBox="40 15 80 50">
            <Line x1={10} y1={20} x2={50} y2={20 + weight} />
            <Line x1={90} y1={20} x2={50} y2={20 + weight} />
            <Line x1={0} y1={20} x2={90} y2={20} secondary />
            <Line x1={90} y1={20} x2={90} y2={60} secondary />
            <circle
              cx={90}
              cy={20}
              strokeWidth="0.5"
              stroke="var(--colors-gray8)"
              strokeDasharray="1"
              r="40"
              fill="none"
            />
            <motion.path
              d={path}
              fill="none"
              stroke="var(--colors-gray12)"
              strokeWidth="1"
            />
            <ControlPoint y={19 + weight} />
            <Endpoint cx={10} cy={20} r="1" />
            <Endpoint cx={90} cy={20} r="1" />
            <Endpoint cx={90} cy={60} r="0.5" secondary />
            <Endpoint cx={90 + endpoint.x} cy={20 + endpoint.y} r="1" />
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

  variants: {
    secondary: {
      true: {
        fill: "$gray8",
        stroke: "$gray8",
      },
    },
  },
});

const Line = styled("line", {
  strokeWidth: 0.5,
  stroke: "$blue9",

  variants: {
    secondary: {
      true: {
        stroke: "$gray8",
      },
    },
  },
});
