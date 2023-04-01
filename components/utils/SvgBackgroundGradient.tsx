import React from "react";
import { darkTheme, styled } from "~/stitches.config";

export type Color = "yellow" | "green" | string;

export type SvgBackgroundGradientProps = {
  id: string;
  color?: Color;
  startColor?: Color;
  stopColor?: Color;
};

export const getFillFromId = (id: string) => `url('#${id}')`;

export function SvgBackgroundGradient({
  id,
  color,
  startColor = color,
  stopColor = color,
}: SvgBackgroundGradientProps) {
  return (
    <defs>
      <linearGradient id={id} gradientTransform="rotate(45)">
        <stop offset="0%" stopColor={startColor} />
        <stop offset="100%" stopColor={stopColor} />
      </linearGradient>
    </defs>
  );
}

const StopStart = styled("stop", {
  stopColor: "$colors$blue4",

  [`.${darkTheme} &`]: {
    stopColor: "$colors$blue7",
  },

  variants: {
    color: {
      green: {
        stopColor: "$colors$green4",
        [`.${darkTheme} &`]: {
          stopColor: "$colors$green7",
        },
      },
      yellow: {
        stopColor: "$colors$yellow4",
        [`.${darkTheme} &`]: {
          stopColor: "$colors$yellow7",
        },
      },
      red: {
        stopColor: "$colors$red4",
        [`.${darkTheme} &`]: {
          stopColor: "$colors$red7",
        },
      },
    },
  },
});

const StopEnd = styled("stop", {
  stopColor: "$colors$blue6",

  [`.${darkTheme} &`]: {
    stopColor: "$colors$blue9",
  },

  variants: {
    color: {
      green: {
        stopColor: "$colors$green6",
        [`.${darkTheme} &`]: {
          stopColor: "$colors$green9",
        },
      },
      yellow: {
        stopColor: "$colors$yellow6",
        [`.${darkTheme} &`]: {
          stopColor: "$colors$yellow9",
        },
      },
      red: {
        stopColor: "$colors$red6",
        [`.${darkTheme} &`]: {
          stopColor: "$colors$red9",
        },
      },
    },
  },
});
