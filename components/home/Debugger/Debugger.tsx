import React from "react";
import { motion } from "framer-motion";
import { darkTheme, styled } from "~/stitches.config";

import { Token } from "../TokenizerVisual";
import { VisualWrapper } from "../shared";
import {
  getFillFromId,
  SvgBackgroundGradient,
} from "~/components/utils/SvgBackgroundGradient";

const GAP = 8;

export const Debugger = () => {
  return (
    <VisualWrapper>
      <svg viewBox="-1 -1 102 102" style={{ position: "relative" }}>
        <motion.g style={{ x: 21, y: 40 }}>
          <Rect width="73" height="42" rx="2" x="-6" y="-10.5" />
          <Text>function add(a, b) {`{`}</Text>
          <Text x={5} y={GAP}>
            const sum = a + b
          </Text>
          <Text x={5} y={GAP * 2}>
            return sum
          </Text>
          <Text y={GAP * 3}>{`}`}</Text>
        </motion.g>
        <g>
          <FocusCircle x={62} y={46.5} size="sm" color="yellow">
            a
          </FocusCircle>
          <Token text="a: 5" color="yellow" y={18} x={20} />
          <Path d="M 40.5 24 Q 66 20 62 42.5" />
          <Point cx={40.5} cy={24} />
          <Point cx={62} cy={42.5} />
        </g>
        <g>
          <FocusCircle x={76} y={46.5} size="sm" color="green">
            b
          </FocusCircle>
          <Token text="b: 3" color="green" x={50} />
          <Path d="M 70.5 7 Q 95 10 78 43.5" />
          <Point cx={78} cy={43} />
          <Point cx={70.5} cy={7} />
        </g>
        <g>
          <FocusCircle x={52} y={54.5}>
            sum
          </FocusCircle>
          <Token text="sum: 8" y={75} x={50} />
          <Path d="M 46 58.5 Q 34 73 50 81" />
          <Point cx={46} cy={58.5} />
          <Point cx={50} cy={81} />
        </g>
      </svg>
    </VisualWrapper>
  );
};

const Path = styled("path", {
  strokeWidth: 0.6,
  stroke: "$gray12",
  fill: "none",
});

const Point = (props) => <_Point r="1.1" {...props} />;

const _Point = styled("circle", {
  fill: "$gray3",
  stroke: "$gray12",
  strokeWidth: 0.2,
});

const Rect = styled("rect", {
  fill: "$gray5",
  stroke: "$gray10",
  strokeWidth: 0.2,
  strokeDasharray: "2 1",
});

const Text = styled("text", {
  fontFamily: "$mono",
  fontSize: 5,
  fill: "$gray8",

  variants: {
    main: {
      true: {
        fill: "$gray12",

        [`.${darkTheme} &`]: {
          fill: "$gray1",
        },
      },
    },
  },
});

const sizeMap = {
  sm: 4,
  md: 7,
};

const FocusCircle = ({
  x = 0,
  y = 0,
  size = "md",
  color = undefined,
  children,
}) => {
  const id = React.useId();
  const radius = sizeMap[size];
  return (
    <>
      <SvgBackgroundGradient id={id} color={color} />
      <motion.g style={{ x, y }}>
        <Circle r={radius} shadow cx="0.5" cy="0.5" />
        <Circle r={radius} fill={getFillFromId(id)} />
        <Text textAnchor="middle" dominantBaseline="middle" main>
          {children}
        </Text>
      </motion.g>
    </>
  );
};

const Circle = styled("circle", {
  stroke: "$gray12",
  strokeWidth: 0.2,

  [`.${darkTheme} &`]: {
    stroke: "$gray1",
  },

  variants: {
    shadow: {
      true: {
        fill: "$gray12",

        [`.${darkTheme} &`]: {
          fill: "$gray1",
        },
      },
    },
  },
});
