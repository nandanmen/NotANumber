import React from "react";
import { motion } from "framer-motion";
import { darkTheme, styled } from "~/stitches.config";
import { VisualWrapper } from "../shared";
import {
  getFillFromId,
  SvgBackgroundGradient,
} from "~/components/utils/SvgBackgroundGradient";

export const HowArraysWork = () => {
  return (
    <VisualWrapper>
      <svg viewBox="-1 -1 102 102" style={{ position: "relative" }}>
        <motion.g style={{ y: 50, x: 50 }}>
          <motion.g style={{ y: 8 }}>
            <Square disabled size="xs" x={-32} />
            <Square disabled size="xs" x={-10} />
            <Square disabled size="xs" x={12} />
          </motion.g>
          <motion.g style={{ y: -28 }}>
            <Square disabled size="xs" x={-32} />
            <Square disabled size="xs" x={-10} />
            <Square disabled size="xs" x={12} />
          </motion.g>
          <motion.g style={{ x: -42, y: -12.5 }}>
            <GradientSquare color="yellow" size="sm" />
            <Text x="12.5" y="12.5">
              0x12
            </Text>
          </motion.g>
          <motion.g style={{ x: -15, y: -15 }}>
            <GradientSquare color="blue" />
            <Text x="15" y="15">
              Hello!
            </Text>
          </motion.g>
          <motion.g style={{ x: 17, y: -12.5 }}>
            <GradientSquare color="green" size="sm" />
            <Text x="12.5" y="12.5">
              true
            </Text>
          </motion.g>
        </motion.g>
      </svg>
    </VisualWrapper>
  );
};

const Text = styled("text", {
  fontFamily: "$mono",
  dominantBaseline: "middle",
  textAnchor: "middle",
  fontSize: 5,
});

const GradientSquare = ({
  color,
  x = 0,
  y = 0,
  size = undefined,
  ...props
}) => {
  const id = React.useId();
  return (
    <>
      <SvgBackgroundGradient id={id} color={color} />
      <motion.g style={{ x, y }}>
        <Shadow rx="2" x="1" y="1" size={size} />
        <Square fill={getFillFromId(id)} {...props} size={size} />
      </motion.g>
    </>
  );
};

const Square = (props) => <Rect rx="2" {...props} />;

const Rect = styled("rect", {
  strokeWidth: 0.2,
  stroke: "$gray12",
  width: 30,
  height: 30,

  [`.${darkTheme} &`]: {
    stroke: "$gray1",
  },

  variants: {
    disabled: {
      true: {
        stroke: "$gray10",
        fill: "$gray6",
        strokeDasharray: "2 1",

        [`.${darkTheme} &`]: {
          stroke: "$gray10",
        },
      },
    },
    size: {
      sm: {
        width: 25,
        height: 25,
      },
      xs: {
        width: 20,
        height: 20,
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
