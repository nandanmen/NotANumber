import React from "react";
import { motion } from "framer-motion";
import { styled, darkTheme } from "~/stitches.config";
import { FaArrowRight } from "react-icons/fa";

const ASPECT_RATIO = 4 / 3;
const PADDING = 6;
const HEIGHT = 100 * (1 / ASPECT_RATIO) + PADDING * 2;
const infiniteTransition = {
  type: "tween",
  duration: 5,
  ease: "linear",
  repeat: Infinity,
};

export const MovingArrow = ({ playing }) => {
  const lineRef = React.useRef<SVGLineElement>(null);
  const circleRef = React.useRef<SVGCircleElement>(null);

  const getCurrentRotation = () => {
    if (!circleRef.current) return 0;
    const transform = circleRef.current.style.transform;
    if (!transform || transform === "none") return 0;
    const [currentRotation] = transform.split("rotate(")[1].split("deg)");
    return Number(currentRotation);
  };

  return (
    <ArrowWrapper>
      <motion.svg
        width="100%"
        height="100%"
        viewBox={`-${PADDING} -${PADDING} ${100 + PADDING * 2} ${HEIGHT}`}
      >
        <Line
          ref={lineRef}
          x1={0}
          y1={HEIGHT / 2}
          x2={100}
          y2={HEIGHT / 2}
          initial="off"
          animate={playing ? "on" : "off"}
          variants={{
            on: () => {
              const currentOffset = getCurrentValue(
                lineRef,
                "strokeDashoffset"
              );
              return {
                strokeDashoffset: currentOffset - 90,
                transition: infiniteTransition,
              };
            },
            off: () => {
              const currentOffset = getCurrentValue(
                lineRef,
                "strokeDashoffset"
              );
              const finalOffset = currentOffset < -9 ? currentOffset - 9 : 0;
              return {
                strokeDashoffset: currentOffset,
                transition: finalOffset
                  ? {
                      type: "inertia",
                      velocity: -18,
                    }
                  : { type: false },
              };
            },
          }}
        />
        <Endpoint cx={0} cy={HEIGHT / 2} r="3" />
        <Endpoint cx={100} cy={HEIGHT / 2} r="3" />
        <ArrowCircle
          ref={circleRef}
          r="16"
          cx={50}
          cy={HEIGHT / 2}
          initial={{ rotate: 0 }}
          animate={playing ? "on" : "off"}
          variants={{
            on: () => {
              const rotation = getCurrentRotation();
              return {
                rotate: rotation + 360,
                transition: infiniteTransition,
              };
            },
            off: () => {
              const rotation = getCurrentRotation();
              return {
                rotate: rotation,
                transition: {
                  type: "inertia",
                  velocity: 360 / infiniteTransition.duration,
                },
              };
            },
          }}
        />
        <Arrow x={42} y={HEIGHT / 2 - 8} />
      </motion.svg>
    </ArrowWrapper>
  );
};

const Arrow = styled(FaArrowRight, {
  fill: "$blue10",

  [`.${darkTheme} &`]: {
    fill: "$blueDark11",
  },
});

const getCurrentValue = (ref: React.RefObject<SVGElement>, style: string) => {
  if (typeof window === "undefined") return 0;
  if (!ref.current) return 0;
  const [currentOffset] = getComputedStyle(ref.current)[style].split("px");
  return Number(currentOffset);
};

const Line = styled(motion.line, {
  stroke: "$blue9",
  strokeWidth: 1,
  strokeDasharray: "3",
});

const ArrowCircle = styled(motion.circle, {
  stroke: "$blue9",
  strokeWidth: 1,
  strokeDasharray: "5",
  fill: "$blue5",

  [`.${darkTheme} &`]: {
    fill: "$blueDark5",
  },
});

const Endpoint = styled("circle", {
  fill: "$blue9",
});

const ArrowWrapper = styled("div", {
  width: "calc($$gap + 20px)",
  aspectRatio: ASPECT_RATIO,
});
