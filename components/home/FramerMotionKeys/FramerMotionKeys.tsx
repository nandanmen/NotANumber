import React from "react";
import { motion, useTransform } from "framer-motion";
import { darkTheme, styled } from "~/stitches.config";
import { VisualWrapper } from "../shared";
import {
  getFillFromId,
  SvgBackgroundGradient,
} from "~/components/utils/SvgBackgroundGradient";
import { useRelativeMouse } from "../SlidingWindow";

export const FramerMotionKeys = () => {
  const ref = React.useRef();
  const mouseX = useRelativeMouse(ref);

  const x = useTransform(mouseX, [-100, 500], [-5, 5]);
  const maskX = useTransform(x, (x) => x * -1);

  return (
    <VisualWrapper>
      <svg viewBox="-1 -1 102 102" style={{ position: "relative" }} ref={ref}>
        <mask id="framer-motion-keys-mask">
          <rect x="0" y="0" width="100" height="100" fill="black" />
          <motion.g style={{ x: maskX }}>
            <Square fill="white" />
          </motion.g>
        </mask>
        <motion.g style={{ y: 50, x: 50 }}>
          <motion.g style={{ x }}>
            <BackgroundText x="-30" y="3.5">
              中
            </BackgroundText>
            <BackgroundText x="30" y="3.5">
              校
            </BackgroundText>
          </motion.g>
          <Shadow rx="2" x="-24" y="-31.5" />
          <motion.g style={{ x: -25, y: -32.5 }}>
            <GradientSquare color="blue" />
            <motion.g style={{ x }} mask="url('#framer-motion-keys-mask')">
              <Text x="-5" y="36">
                中
              </Text>
              <Text x="25" y="36">
                学
              </Text>
              <Text x="55" y="36">
                校
              </Text>
            </motion.g>
          </motion.g>
        </motion.g>
      </svg>
    </VisualWrapper>
  );
};

const Text = styled("text", {
  dominantBaseline: "middle",
  textAnchor: "middle",
  fontSize: 30,
  lineHeight: 1,
  fontWeight: "bold",
});

const BackgroundText = styled(Text, {
  stroke: "$gray8",
  strokeWidth: 0.5,
  fill: "none",
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
        <Square fill={getFillFromId(id)} {...props} size={size} />
      </motion.g>
    </>
  );
};

const Square = (props) => <Rect rx="2" {...props} />;

const Rect = styled("rect", {
  strokeWidth: 0.2,
  stroke: "$gray12",
  width: 50,
  height: 65,

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
