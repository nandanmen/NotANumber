import React from "react";
import { VisualWrapper } from "../shared";
import { darkTheme, styled } from "~/stitches.config";
import { Svg } from "app/svg-paths/components/svg";

const PADDING = 4;

const Label = ({ x, y, children }) => {
  const len = children.length * 2.4;
  return (
    <g transform={`translate(${x}, ${y})`}>
      <Rect rx="2" width={len + PADDING * 2} type="small" />
      <Text x={PADDING} y="6.4" type="small">
        {children}
      </Text>
    </g>
  );
};

export const SvgPaths = () => {
  return (
    <VisualWrapper>
      <Svg
        size={100}
        grid={false}
        style={{ position: "relative" }}
        config={{ pan: { x: 0, y: 0 }, padding: 0 }}
      >
        <Line x1="30" y1="80" x2="70" y2="20" />
        <Path d="M 10 60 q 20 20 40 -10 t 40 -10" />
        <Point cx="10" cy="60" r="2" />
        <Point cx="50" cy="50" r="2" />
        <Point cx="90" cy="40" r="2" />
        <Point secondary cx="30" cy="80" r="1" />
        <Point secondary cx="70" cy="20" r="1" />
        <g transform="translate(30, 72)">
          <Label x={20} y={-9}>
            q 20 20 40 -10
          </Label>
          <path
            fill="none"
            strokeWidth="0.5"
            stroke="var(--colors-gray10)"
            strokeDasharray="1"
            d="M 0 0 q 10 10 20 1"
          />
          <Circle cx="0" cy="0" r="1.2" />
          <Circle cx="20" cy="1" r="1.2" />
        </g>
        <g transform="translate(20, 20)">
          <Label x={0} y={0}>
            t 40 -10
          </Label>
          <path
            fill="none"
            strokeWidth="0.5"
            stroke="var(--colors-gray10)"
            strokeDasharray="1"
            d="M 27 5 q 10 -10 23 3"
          />
          <Circle cx="27" cy="5" r="1.2" />
          <Circle cx="50" cy="8" r="1.2" />
        </g>
      </Svg>
    </VisualWrapper>
  );
};

const Circle = styled("circle", {
  stroke: "$gray11",
  fill: "$gray3",
  strokeWidth: 0.2,

  [`.${darkTheme} &`]: {
    stroke: "$gray1",
    fill: "$gray12",
  },
});

const Text = styled("text", {
  fontFamily: "$mono",
  fontSize: 4,
  fill: "$gray12",
});

const Line = styled("line", {
  stroke: "$gray10",
  strokeWidth: 1,
});

const Point = styled("circle", {
  stroke: "$gray12",
  fill: "$gray3",

  variants: {
    secondary: {
      true: {
        fill: "$gray10",
        stroke: "$gray10",
      },
    },
  },
});

const Path = styled("path", {
  fill: "none",
  stroke: "$gray12",
  strokeWidth: 2,
});

const TEXT_SIZE = 5;

const Rect = styled("rect", {
  stroke: "$gray12",
  strokeWidth: 0.2,
  height: TEXT_SIZE + PADDING * 2,

  [`.${darkTheme} &`]: {
    stroke: "$gray1",
  },

  variants: {
    type: {
      small: {
        height: 10,
        stroke: "$gray11",
        fill: "$gray5",

        [`.${darkTheme} &`]: {
          stroke: "$gray12",
          fill: "$gray2",
        },
      },
    },
  },
});
