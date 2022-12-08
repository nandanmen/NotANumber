import React from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { styled } from "~/stitches.config";
import { VisualWrapper } from "../shared";

const range = (end: number, start = 0) => {
  const length = end - start;
  return Array.from({ length }, (_, i) => start + i);
};

const SQUARE_SIZE = 18;
const ACTIVE_SQUARE_SIZE = SQUARE_SIZE * 1.25;
const GAP = 2;
const COLS = 4;

const COLOR_MAP = ["blue", "green", "yellow", "red"];
const WINDOW_STROKE_WIDTH = 0.5;
const WINDOW_WIDTH = 44;
const WINDOW_HEIGHT = 50;
const WINDOW_Y_OFFSET = 4;

export const SlidingWindow = () => {
  const mouseX = useMotionValue(0);
  const boxRef = React.useRef(null);

  const windowX = useTransform(mouseX, [-100, 500], [-11, 89 - WINDOW_WIDTH]);
  const maskX = useTransform(windowX, (x) => x + WINDOW_STROKE_WIDTH / 2);

  React.useEffect(() => {
    const handleMouse = (evt) => {
      const rect = boxRef.current?.getBoundingClientRect();
      mouseX.set(evt.clientX - rect.left);
    };
    document.addEventListener("mousemove", handleMouse);
    return () => document.removeEventListener("mousemove", handleMouse);
  }, [mouseX]);

  return (
    <VisualWrapper>
      <svg
        viewBox="-1 -1 102 102"
        style={{ position: "relative" }}
        ref={boxRef}
      >
        <motion.g style={{ x: 11, y: 21 }}>
          <mask id="window-mask">
            <rect x="-11" y="-21" width="100%" height="100%" fill="black" />
            <motion.rect
              style={{ x: maskX }}
              y={WINDOW_Y_OFFSET + WINDOW_STROKE_WIDTH / 2}
              rx="4"
              width={WINDOW_WIDTH - WINDOW_STROKE_WIDTH}
              height={WINDOW_HEIGHT - WINDOW_STROKE_WIDTH}
              fill="white"
            />
          </mask>
          <g>
            {range(COLS).map((index) => (
              <Rect key={`top-${index}`} x={(SQUARE_SIZE + GAP) * index} />
            ))}
            {range(COLS).map((index) => (
              <motion.g
                key={`middle-${index}`}
                style={{ x: (SQUARE_SIZE + GAP) * index, y: SQUARE_SIZE + GAP }}
              >
                <Rect active />
                <Text x={SQUARE_SIZE / 2} y={SQUARE_SIZE / 2}>
                  {(index + 1) * 10}
                </Text>
              </motion.g>
            ))}
            {range(COLS).map((index) => (
              <Rect
                key={`bottom-${index}`}
                x={(SQUARE_SIZE + GAP) * index}
                y={(SQUARE_SIZE + GAP) * 2}
              />
            ))}
          </g>
          <motion.g style={{ x: windowX, y: WINDOW_Y_OFFSET }}>
            <Window rx="4" />
          </motion.g>
          <g mask="url(#window-mask)">
            {range(COLS).map((index) => {
              const diff = (ACTIVE_SQUARE_SIZE - SQUARE_SIZE) / 2;
              return (
                <motion.g
                  key={`middle-${index}`}
                  style={{
                    x: (ACTIVE_SQUARE_SIZE + GAP) * index - 9,
                    y: SQUARE_SIZE + GAP - diff,
                  }}
                >
                  <ActiveRect color={COLOR_MAP[index]} />
                  <Text
                    x={ACTIVE_SQUARE_SIZE / 2}
                    y={ACTIVE_SQUARE_SIZE / 2}
                    active
                  >
                    {(index + 1) * 10}
                  </Text>
                </motion.g>
              );
            })}
          </g>
        </motion.g>
      </svg>
    </VisualWrapper>
  );
};

const Window = styled(motion.rect, {
  width: WINDOW_WIDTH,
  height: WINDOW_HEIGHT,
  stroke: "$gray12",
  fill: "rgba(255, 255, 255, 0.5)",
  strokeWidth: WINDOW_STROKE_WIDTH,
});

const ActiveRect = ({ color, x = 0, y = 0, ...props }) => {
  const id = React.useId();
  return (
    <>
      <defs>
        <linearGradient id={id} gradientTransform="rotate(45)">
          <stop offset="0%" stopColor={`var(--colors-${color}4)`} />
          <stop offset="100%" stopColor={`var(--colors-${color}6)`} />
        </linearGradient>
      </defs>
      <motion.g style={{ x, y }}>
        <Shadow rx="2" x="1" y="1" />
        <_ActiveRect fill={`url('#${id}')`} rx="2" {...props} />
      </motion.g>
    </>
  );
};

const Shadow = styled("rect", {
  width: ACTIVE_SQUARE_SIZE,
  height: ACTIVE_SQUARE_SIZE,
  fill: "$gray12",
});

const _ActiveRect = styled("rect", {
  width: ACTIVE_SQUARE_SIZE,
  height: ACTIVE_SQUARE_SIZE,
  stroke: "$gray12",
  strokeWidth: 0.2,
});

const Text = styled("text", {
  fontFamily: "$mono",
  textAnchor: "middle",
  dominantBaseline: "middle",
  fontSize: 5,
  fill: "$gray10",

  variants: {
    active: {
      true: {
        fill: "$gray12",
        fontSize: 5 * 1.25,
      },
    },
  },
});

const Rect = (props) => <_Rect rx="2" {...props} />;

const _Rect = styled("rect", {
  width: SQUARE_SIZE,
  height: SQUARE_SIZE,
  stroke: "$gray10",
  strokeWidth: 0.2,
  strokeDasharray: "2 1",
  fill: "$gray6",

  variants: {
    active: {
      true: {
        strokeDasharray: "initial",
        fill: "$gray5",
      },
    },
  },
});
