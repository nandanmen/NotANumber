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

const weight = 20;

export const EdgeRotationProblem = () => {
  const endpoint = getEndpoint(weight);
  const path = `M 10 20
Q 50 ${20 + weight} 90 20
l ${endpoint.x} ${endpoint.y}`;
  return (
    <FullWidth>
      <Visualizer>
        <Content css={{ display: "flex" }}>
          <svg viewBox="40 15 80 50">
            <Line x1={10} y1={20} x2={50} y2={20 + weight} secondary dashed />
            <Line x1={90} y1={20} x2={50} y2={20 + weight} secondary dashed />
            <Line x1={0} y1={20} x2={90} y2={20} secondary />
            <path d={path} fill="none" stroke="var(--colors-gray12)" />
            <path
              d={`M 90 20 l ${endpoint.x} ${endpoint.y}`}
              stroke="var(--colors-gray12)"
              fill="none"
            />
            <Line x1="50" y1="20" x2="50" y2={20 + weight} dashed />
            <ControlPoint y={19 + weight} />
            <ControlPoint y={19} />
            <Endpoint cx={50} cy={20 + weight / 2} r="1.5" active />
            <Text
              x="50"
              y={20 + weight / 2 - 0.2}
              dominantBaseline="central"
              textAnchor="middle"
            >
              y
            </Text>
            <Endpoint cx={10} cy={20} r="1" />
            <Endpoint cx={90} cy={20} r="1" />
            <Endpoint cx={90 + endpoint.x} cy={20 + endpoint.y} r="1" />
            <ArrowGroup style={{ x: 52, y: 15 + weight }}>
              <motion.polygon
                points="0,0 1,0.8 0,1.6"
                style={{ rotate: -180 }}
                fill="currentColor"
              />
              <line
                x1="0.5"
                x2="10"
                y1="0.8"
                y2="0.8"
                stroke="currentColor"
                strokeWidth="0.3"
              />
            </ArrowGroup>
            <Text x="63" y={15.7 + weight} dominantBaseline="central">
              Given this...
            </Text>
            <ArrowGroup style={{ x: 104, y: 55 }}>
              <polygon points="0,0 1,0.8 0,1.6" fill="currentColor" />
              <line
                x1="-10"
                x2="0.5"
                y1="0.8"
                y2="0.8"
                stroke="currentColor"
                strokeWidth="0.3"
              />
            </ArrowGroup>
            <Text x="93" y={55.7} dominantBaseline="central" textAnchor="end">
              ...what are the coordinates of this?
            </Text>
          </svg>
        </Content>
      </Visualizer>
    </FullWidth>
  );
};

const ArrowGroup = styled(motion.g, {
  color: "$gray12",
});

const Text = styled("text", {
  fill: "$gray12",
  fontSize: 1.8,
  fontWeight: "bold",
  fontFamily: "$mono",
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
    active: {
      true: {
        fill: "$blue9",
        stroke: "$blue9",
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
    dashed: {
      true: {
        strokeDasharray: "1",
      },
    },
  },
});
