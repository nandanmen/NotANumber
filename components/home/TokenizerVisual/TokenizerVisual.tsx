import React from "react";
import { motion } from "framer-motion";

import { VisualWrapper } from "../shared";
import { darkTheme, styled } from "~/stitches.config";
import {
  type Color,
  SvgBackgroundGradient,
  getFillFromId,
} from "~/components/utils/SvgBackgroundGradient";

export const TokenizerVisual = () => {
  return (
    <VisualWrapper>
      <svg viewBox="0 0 100 100" style={{ position: "relative" }}>
        <motion.g style={{ x: 21, y: 28 }}>
          <Token text="print" x={0} y={0} />
          <Token text="(" x={26} y={0} color="yellow" />
          <Token text={`"hello, world!"`} x={10} y={16} color="green" />
          <Token text=")" x={0} y={32} color="yellow" />
        </motion.g>
        <motion.g style={{ x: 50, y: 57.5 }}>
          <Label x={4} y={17}>
            String Literal
          </Label>
          <Path d="M 0 0 Q -12 22 4 22" />
          <Circle cx="0" cy="0" r="1.2" />
          <Circle cx="4" cy="22" r="1.2" />
        </motion.g>
        <motion.g style={{ x: 8, y: 8 }}>
          <Label x={0} y={0}>
            Left Parenthesis
          </Label>
          <Path d="M 46.3 5 Q 60 10 49.5 20.5" />
          <Circle cx="46.3" cy="5" r="1.2" />
          <Circle cx="49.5" cy="20.5" r="1.2" />
        </motion.g>
      </svg>
    </VisualWrapper>
  );
};

const Path = styled("path", {
  strokeWidth: 0.5,
  stroke: "$gray11",
  fill: "none",
  strokeDasharray: "2 1",

  [`.${darkTheme} &`]: {
    stroke: "$gray12",
  },
});

const Circle = styled("circle", {
  stroke: "$gray11",
  fill: "$gray3",
  strokeWidth: 0.2,

  [`.${darkTheme} &`]: {
    stroke: "$gray1",
    fill: "$gray12",
  },
});

const TEXT_WIDTH = 3;
const TEXT_SIZE = 5;
const PADDING = 4;

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

const Label = ({ x, y, children }) => {
  const len = children.length * 2.4;
  return (
    <motion.g style={{ x, y }}>
      <Rect rx="2" width={len + PADDING * 2} type="small" />
      <Text x={PADDING} y="6.4" type="small">
        {children}
      </Text>
    </motion.g>
  );
};

type TokenProps = {
  x?: number;
  y?: number;
  text: string;
  color?: Color;
};

export const Token = ({ x = 0, y = 0, text, color }: TokenProps) => {
  const id = React.useId();
  const len = text.length * TEXT_WIDTH;
  return (
    <>
      <SvgBackgroundGradient id={id} color={color} />
      <motion.g style={{ x, y }}>
        <Shadow rx="2" x="1" y="1" width={len + PADDING * 2} />
        <Rect fill={getFillFromId(id)} rx="2" width={len + PADDING * 2} />
        <Text x={PADDING} y="8.3">
          {text}
        </Text>
      </motion.g>
    </>
  );
};

const Text = styled("text", {
  fontFamily: "$mono",
  fontSize: TEXT_SIZE,

  variants: {
    type: {
      small: {
        fontSize: 4,

        [`.${darkTheme} &`]: {
          fill: "$gray12",
        },
      },
    },
  },
});

const Shadow = styled(Rect, {
  fill: "$gray12",

  [`.${darkTheme} &`]: {
    fill: "$gray1",
  },
});
