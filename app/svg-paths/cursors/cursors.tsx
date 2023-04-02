"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInterval } from "~/lib/use-interval";
import { PathVisualizer, Sections, Text } from "../components/path-visualizer";
import { Svg, useSvgContext } from "../components/svg";
import { heart } from "../index/index";
import { useIndexContext } from "../components/index-provider";
import { Tooltip } from "../components/svg/tooltip";
import { parsePath, type Command } from "../utils";

const heartCommands = parsePath(heart);

const usePathAnimation = (
  commands: Command[],
  { onComplete }: { onComplete?: () => void } = {}
) => {
  const [playing, setPlaying] = React.useState(true);
  const [index, setIndex] = React.useState(0);

  useInterval(
    () => {
      if (playing) {
        if (index === commands.length - 1) {
          setPlaying(false);
          onComplete?.();
          return;
        }
        setIndex(index + 1);
      }
    },
    {
      delay: playing ? 600 : null,
    }
  );

  const play = React.useCallback(() => {
    if (index === commands.length - 1) {
      setIndex(0);
    }
    setPlaying(true);
  }, [index, commands]);

  return {
    index,
    play,
    playing,
    next: () => setIndex(Math.min(commands.length - 1, index + 1)),
    prev: () => setIndex(Math.max(0, index - 1)),
  };
};

const CursorOverview = ({ commands = heartCommands, size = 25 }) => {
  const { index, play } = usePathAnimation(commands);
  const currentCommand = commands[index];
  return (
    <div className="w-full">
      <Svg size={size}>
        <PathVisualizer path={commands} index={index} />
        <CursorPoint cx={currentCommand.x} cy={currentCommand.y} />
      </Svg>
      <button onClick={play}>Play</button>
    </div>
  );
};

const CursorPoint = ({ cx, cy }) => {
  const { getRelative } = useSvgContext();
  return (
    <motion.g
      animate={{ x: cx, y: cy }}
      transition={{ type: "spring", bounce: 0 }}
    >
      <motion.circle
        r={getRelative(1.3)}
        className="fill-blue9 stroke-current"
        strokeWidth={getRelative(0.6)}
      />
    </motion.g>
  );
};

// --

const corner = parsePath("M 5 5 v 5 L 10 15 h 5");

const Corner = () => {
  const [showText, setShowText] = React.useState(false);
  const { index, play, next, prev } = usePathAnimation(corner, {
    onComplete: () => setShowText(true),
  });
  const currentCommand = corner[index];

  return (
    <div className="w-full">
      <Svg size={20}>
        <PathVisualizer path={corner} index={index} helpers={false} />
        <CursorPoint cx={currentCommand.x} cy={currentCommand.y} />
        {showText && (
          <motion.g animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
            <Text x="3.5" y="2">
              M 5 5
            </Text>
            <Text x="6" y="7.5">
              v 5
            </Text>
            <Text x="8.5" y="12">
              L 10 15
            </Text>
            <Text x="12.5" y="14.5">
              h 5
            </Text>
            <Tooltip x={5} y={5}>
              (5, 5)
            </Tooltip>
            <Tooltip x={15} y={15}>
              (15, 15)
            </Tooltip>
            <Tooltip x={5} y={10} placement="left">
              (5, 10)
            </Tooltip>
            <Tooltip x={10} y={15} placement="bottom">
              (10, 15)
            </Tooltip>
          </motion.g>
        )}
      </Svg>
      <div>
        <button onClick={play}>Play</button>
        <button onClick={prev}>Prev</button>
        <button onClick={next}>Next</button>
      </div>
    </div>
  );
};

// --

const AbsoluteRelative = () => {
  return (
    <div className="w-full">
      <Svg size={30}>
        <PathVisualizer path="M 5 5 L 10 15" />
        <PathVisualizer path="M 15 5 l 10 15" />
        <Tooltip x={5} y={5} placement="top">
          (5, 5)
        </Tooltip>
        <Tooltip x={15} y={5} placement="top">
          (15, 5)
        </Tooltip>
        <Tooltip x={10} y={15} placement="bottom">
          (10, 15)
        </Tooltip>
        <Tooltip x={25} y={20} placement="bottom">
          (25, 20)
        </Tooltip>
      </Svg>
    </div>
  );
};

// --

const mapIndexToComponent = [CursorOverview, Corner, AbsoluteRelative];

export function Cursors() {
  const { index } = useIndexContext();
  const Component = mapIndexToComponent[index];
  if (!Component) return null;
  return <Component />;
}
