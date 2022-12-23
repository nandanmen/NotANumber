import React from "react";
import { VisualWrapper } from "../shared";
import { darkTheme, styled } from "~/stitches.config";
import {
  SvgBackgroundGradient,
  getFillFromId,
} from "~/components/utils/SvgBackgroundGradient";

export const FramerMagicMotion = () => {
  const id = React.useId();
  return (
    <VisualWrapper>
      <svg viewBox="0 0 100 100" style={{ position: "relative" }}>
        <SvgBackgroundGradient id={id} />
        <Rect rx="2" x="40" y="10" type="secondary" />
        <Rect rx="2" x="11" y="41" type="shadow" />
        <Rect rx="2" x="10" y="40" fill={getFillFromId(id)} />
        <Path d="M 10 40 A 45 45 0 0 1 40 10" />
        <Path d="M 60 40 A 80 80 0 0 1 90 10" />
        <Path d="M 60 90 A 80 80 0 0 0 90 60" />
        <Point cx="10" cy="40" r="2" />
        <Point cx="60" cy="40" r="2" />
        <Point cx="10" cy="90" r="2" />
        <Point cx="60" cy="90" r="2" />
        <Point cx="40" cy="10" r="2" />
        <Point cx="90" cy="10" r="2" />
        <Point cx="90" cy="60" r="2" />
      </svg>
    </VisualWrapper>
  );
};

const Point = styled("circle", {
  stroke: "$gray11",
  fill: "$gray3",
  strokeWidth: 0.2,
});

const Path = styled("path", {
  fill: "none",
  stroke: "$gray12",
  strokeDasharray: "2 1",
  strokeWidth: 0.2,
});

const Rect = styled("rect", {
  width: 50,
  height: 50,
  strokeWidth: 0.2,
  stroke: "$gray12",

  [`.${darkTheme} &`]: {
    stroke: "$gray1",
  },

  variants: {
    type: {
      secondary: {
        fill: "$gray5",
        stroke: "$gray10",
        strokeDasharray: "2 1",

        [`.${darkTheme} &`]: {
          stroke: "$gray10",
          fill: "$gray3",
        },
      },
      shadow: {
        fill: "$gray12",

        [`.${darkTheme} &`]: {
          fill: "$gray1",
        },
      },
    },
  },
});
