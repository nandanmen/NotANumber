"use client";

import React from "react";
import {
  Command,
  CommandMadeAbsolute,
  makeAbsolute,
  parseSVG,
} from "svg-path-parser";
import { motion } from "framer-motion";
import { useInterval } from "~/lib/use-interval";
import { PathVisualizer } from "../components/path-visualizer";
import { Svg, useSvgContext } from "../components/svg";
import { heart } from "../index";
import produce from "immer";
import { useIndexContext } from "../components/index-provider";

const heartCommands = parseSVG(heart);

const usePathAnimation = (commands: Command[]) => {
  const [playing, setPlaying] = React.useState(true);
  const [index, setIndex] = React.useState(0);

  useInterval(
    () => {
      if (playing) {
        if (index === commands.length - 1) {
          setPlaying(false);
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

  return { index, play, playing };
};

const CursorOverview = ({ commands = heartCommands, size = 25 }) => {
  const { index, play } = usePathAnimation(commands);

  const absoluteCommands = React.useMemo(() => {
    return produce(commands, (draft) => {
      makeAbsolute(draft);
    }) as CommandMadeAbsolute[];
  }, [commands]);
  const currentCommand = absoluteCommands[index];

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

const corner = parseSVG("M 5 5 v 5 L 10 15 h 5");
const absoluteCorner = produce(corner, (draft) => {
  makeAbsolute(draft);
}) as CommandMadeAbsolute[];

const Corner = () => {
  const { index, play } = usePathAnimation(corner);
  const currentCommand = absoluteCorner[index];

  return (
    <div className="w-full">
      <Svg size={20}>
        <PathVisualizer path={corner} index={index} />
        <CursorPoint cx={currentCommand.x} cy={currentCommand.y} />
      </Svg>
      <button onClick={play}>Play</button>
    </div>
  );
};

// --

const mapIndexToComponent = [CursorOverview, Corner];

export function Cursors() {
  const { index } = useIndexContext();
  const Component = mapIndexToComponent[index];
  if (!Component) return null;
  return <Component />;
}
