import React from "react";
import { motion } from "framer-motion";

import { Content } from "~/components/Visualizer";
import { styled } from "~/stitches.config";

const angle = (60 * Math.PI) / 180;
const cubeLength = 15;

export const TokenizerVisual = () => {
  const _x = cubeLength * Math.sin(angle);
  const _y = cubeLength * Math.cos(angle);
  return (
    <Wrapper>
      <Background />
      <svg viewBox="0 0 100 100" style={{ position: "relative" }}>
        <defs>
          <linearGradient id="top-gradient" gradientTransform="rotate(45)">
            <stop offset="0%" stopColor="var(--colors-blue4)" />
            <stop offset="100%" stopColor="var(--colors-blue6)" />
          </linearGradient>
        </defs>
        <motion.g style={{ x: 50 - _x, y: 50 - cubeLength - _y }}>
          <ellipse
            fill="var(--colors-gray6)"
            cx={_x}
            cy={cubeLength + 2 * _y + 4}
            rx="32"
            ry="20"
          />
          <Cube />
          <Cube x={_x} y={cubeLength + _y} color="yellow" />
          <Cube x={-_x} y={cubeLength + _y} color="green" />
        </motion.g>
      </svg>
    </Wrapper>
  );
};

const Cube = ({ x = 0, y = 0, color = "blue" }) => {
  const _x = cubeLength * Math.sin(angle);
  const _y = cubeLength * Math.cos(angle);
  return (
    <motion.g style={{ x, y }}>
      <Side
        d={`M 0 0 v ${cubeLength} l ${_x} ${_y} v -${cubeLength} z`}
        fill={`var(--colors-${color}7)`}
      />
      <Side
        d={`M 0 0 l ${_x} -${_y} l ${_x} ${_y} l -${_x} ${_y} z`}
        fill={`var(--colors-${color}5)`}
      />
      <Side
        d={`M ${_x} ${_y} l ${_x} -${_y} v ${cubeLength} l -${_x} ${_y} z`}
        fill={`var(--colors-${color}8)`}
      />
    </motion.g>
  );
};

const Square = styled("div", {
  $$gap: "10%",
  width: "50%",
  aspectRatio: 1,
  position: "absolute",
  background: "linear-gradient(-45deg, $blue6, $blue5)",
  border: "1px solid $gray12",
  borderRadius: 12,
  boxShadow: "4px 4px 0 $colors$gray12",

  variants: {
    inactive: {
      true: {
        background: "$gray4",
        border: "1px dashed $gray10",
        boxShadow: "none",
      },
    },
  },
});

const Background = styled(Content, {
  position: "absolute",
  inset: 0,
  borderRadius: 9999,
  border: "1px solid $gray8",
});

const Wrapper = styled("div", {
  height: "100%",
  position: "relative",
});

const Side = styled("path", {
  strokeWidth: 0.2,
  stroke: "$gray12",
});
