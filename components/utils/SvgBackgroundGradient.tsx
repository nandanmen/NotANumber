import React from "react";
import { darkTheme, styled } from "~/stitches.config";

export type Color = "yellow" | "green";

export type SvgBackgroundGradientProps = {
  id: string;
  color?: Color;
  startColor?: string;
  stopColor?: string;
  rotate?: number;
};

export const getFillFromId = (id: string) => `url('#${id}')`;

export function SvgBackgroundGradient({
  id,
  color,
  startColor,
  stopColor,
  rotate = 45,
}: SvgBackgroundGradientProps) {
  const _color = startColor ? undefined : color ? color : "blue";
  return (
    <defs>
      <linearGradient id={id} gradientTransform={`rotate(${rotate})`}>
        <StopStart offset="0%" stopColor={startColor} color={_color} />
        <StopEnd offset="100%" stopColor={stopColor} color={_color} />
      </linearGradient>
    </defs>
  );
}

const StopStart = styled("stop", {
  variants: {
    color: {
      blue: {
        stopColor: "$colors$blue4",
        [`.${darkTheme} &`]: {
          stopColor: "$colors$blue7",
        },
      },
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
  variants: {
    color: {
      blue: {
        stopColor: "$colors$blue6",
        [`.${darkTheme} &`]: {
          stopColor: "$colors$blue9",
        },
      },
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
