import React from "react";
import { motion, useAnimationControls } from "framer-motion";
import { FullWidth } from "~/components/FullWidth";
import {
  Visualizer,
  Content,
  Controls,
  PlayButton,
  UndoButton,
} from "~/components/Visualizer";
import { styled } from "~/stitches.config";
import { FileDatabase, type Record } from "../FileDatabase";
import { FaArrowRight } from "react-icons/fa";

const exampleRecords: Record[] = [
  {
    value: [1, "Lorem ipsum"],
  },
  {
    value: [12, "adipiscing elit."],
  },
  {
    value: [1, "null"],
  },
  {
    value: [18, "dolor sit"],
  },
  {
    value: [12, "Vestibulum varius"],
  },
  {
    value: [18, "vel mauris"],
  },
];

const ASPECT_RATIO = 4 / 3;
const HEIGHT = 100 * (1 / ASPECT_RATIO) + 8;

export const SingleFileCompaction = () => {
  const [playing, setPlaying] = React.useState(false);
  const controls = useAnimationControls();
  const lineRef = React.useRef<SVGLineElement>(null);
  return (
    <FullWidth>
      <Visualizer>
        <Content
          css={{
            $$gap: "$space$40",
            display: "flex",
            gap: "$$gap",
            justifyContent: "center",
            padding: "$12",
          }}
          noOverflow
        >
          <FileDatabase records={exampleRecords} />
          <FileDatabase records={[]} />
          <ArrowWrapper>
            <motion.svg
              width="100%"
              height="100%"
              viewBox={`-4 -4 108 ${HEIGHT}`}
            >
              <defs>
                <linearGradient
                  id="arrow-circle"
                  gradientTransform="rotate(45)"
                >
                  <stop offset="0%" stopColor={`var(--colors-blue4)`} />
                  <stop offset="100%" stopColor={`var(--colors-blue6)`} />
                </linearGradient>
              </defs>
              <Line
                ref={lineRef}
                x1={0}
                y1={HEIGHT / 2}
                x2={100}
                y2={HEIGHT / 2}
                initial={{ strokeDashoffset: 0 }}
                animate={controls}
              />
              <Endpoint cx={0} cy={HEIGHT / 2} r="3" />
              <Endpoint cx={100} cy={HEIGHT / 2} r="3" />
              <ArrowCircle
                r="16"
                cx={50}
                cy={HEIGHT / 2}
                animate={{ rotate: 360 }}
                transition={{
                  type: "tween",
                  duration: 5,
                  ease: "linear",
                  repeat: Infinity,
                }}
              />
              <FaArrowRight
                x={42}
                y={HEIGHT / 2 - 8}
                fill="var(--colors-blue10)"
              />
            </motion.svg>
          </ArrowWrapper>
        </Content>
        <Controls>
          <PlayButton
            isPlaying={playing}
            onClick={() => {
              if (playing) {
                controls.stop();
                const currentOffset = getCurrentOffset(lineRef);
                controls.start({
                  strokeDashoffset: currentOffset - 9,
                  transition: {
                    type: "inertia",
                    velocity: -18,
                  },
                });
                setPlaying(false);
              } else {
                const currentOffset = getCurrentOffset(lineRef);
                controls.start({
                  strokeDashoffset: currentOffset - 90,
                  transition: {
                    type: "tween",
                    duration: 5,
                    ease: "linear",
                    repeat: Infinity,
                  },
                });
                setPlaying(true);
              }
            }}
          />
          <UndoButton />
        </Controls>
      </Visualizer>
    </FullWidth>
  );
};

const getCurrentOffset = (lineRef: React.RefObject<SVGLineElement>) => {
  const [currentOffset] = getComputedStyle(
    lineRef.current!
  ).strokeDashoffset.split("px");
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
});

const Endpoint = styled("circle", {
  fill: "$blue9",
});

const ArrowWrapper = styled("div", {
  width: "calc($$gap + 20px)",
  aspectRatio: ASPECT_RATIO,
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
});
