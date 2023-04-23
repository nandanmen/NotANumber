"use client";

import React from "react";
import { motion, useAnimationControls } from "framer-motion";
import { useInterval } from "~/lib/use-interval";
import {
  AnimatedEndpoint,
  PathSection,
  PathSectionPoint,
  PathVisualizer,
  Text,
} from "../components/path-visualizer";
import { Svg, useSvgContext } from "../components/svg";
import { heart } from "../index/index";
import { useIndexContext } from "../components/index-provider";
import { Tooltip } from "../components/svg/tooltip";
import { parsePath, type Command } from "../utils";
import { useStateContext } from "../components/state-context";
import { useDebouncedCallback } from "use-debounce";
import {
  ArrowLeft,
  ArrowRight,
  Pause,
  Play,
  Refresh,
} from "../components/icons";

const Controls = ({ children }) => {
  return (
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-1">
      {children}
    </div>
  );
};

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
  const { index, play, playing } = usePathAnimation(commands);
  const currentCommand = commands[index];
  return (
    <>
      <Svg size={size}>
        <PathVisualizer path={commands} index={index} />
        <CursorPoint
          animate={{ x: currentCommand.x, y: currentCommand.y }}
          transition={{ type: "spring", bounce: 0 }}
        />
      </Svg>
      <Controls>
        <button
          className="bg-gray2 p-2 rounded-xl shadow-md border border-gray8"
          onClick={play}
        >
          {playing ? <Pause /> : <Play />}
        </button>
      </Controls>
    </>
  );
};

type CursorPointProps = React.ComponentPropsWithoutRef<(typeof motion)["g"]>;

const CursorPoint = (props: CursorPointProps) => {
  const { getRelative } = useSvgContext();
  return (
    <motion.g {...props}>
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
  const { index, play, next, prev, playing } = usePathAnimation(corner, {
    onComplete: () => setShowText(true),
  });
  const currentCommand = corner[index];

  return (
    <>
      <Svg size={20}>
        <PathVisualizer path={corner} index={index} helpers={false} />
        <CursorPoint
          animate={{ x: currentCommand.x, y: currentCommand.y }}
          transition={{ type: "spring", bounce: 0 }}
        />
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
      <Controls>
        <button
          className="bg-gray2 p-2 rounded-xl shadow-md border border-gray8"
          onClick={play}
        >
          {playing ? <Pause /> : <Play />}
        </button>
        <button
          className="bg-gray2 p-2 rounded-xl shadow-md border border-gray8"
          onClick={prev}
        >
          <ArrowLeft />
        </button>
        <button
          className="bg-gray2 p-2 rounded-xl shadow-md border border-gray8"
          onClick={next}
        >
          <ArrowRight />
        </button>
      </Controls>
    </>
  );
};

// --

const AbsoluteRelative = () => {
  const { data: absolute, set: setAbsolute } = useStateContext<{
    x: number;
    y: number;
  }>("absolute");
  const { data: relative, set: setRelative } = useStateContext<{
    x: number;
    y: number;
  }>("relative");

  const absoluteCommand = React.useMemo(() => {
    return parsePath(`M ${absolute.x} ${absolute.y} L 10 15`);
  }, [absolute.x, absolute.y]);

  const relativeCommand = React.useMemo(() => {
    return parsePath(`M ${relative.x} ${relative.y} l 10 15`);
  }, [relative.x, relative.y]);

  const absoluteControls = useAnimationControls();
  const animateAbsolute = useDebouncedCallback(() => {
    absoluteControls.start({
      x: 10,
      y: 15,
    });
  }, 1000);

  React.useEffect(() => {
    absoluteControls.start({
      x: absolute.x,
      y: absolute.y,
      transition: { type: false },
    });
    animateAbsolute();
  }, [absoluteControls, animateAbsolute, absolute.x, absolute.y]);

  const relativeControls = useAnimationControls();
  const animateRelative = useDebouncedCallback((x: number, y: number) => {
    relativeControls.start({
      x: x + 10,
      y: y + 15,
    });
  }, 1000);

  React.useEffect(() => {
    const x = relative.x;
    const y = relative.y;
    relativeControls.start({
      x,
      y,
      transition: { type: false },
    });
    animateRelative(x, y);
  }, [relativeControls, animateRelative, relative.x, relative.y]);

  return (
    <>
      <Svg size={30}>
        <PathVisualizer path={absoluteCommand} />
        <PathVisualizer path={relativeCommand} />
        <Tooltip x={absolute.x} y={absolute.y} placement="top">
          ({absolute.x.toFixed(1)}, {absolute.y.toFixed(1)})
        </Tooltip>
        <Tooltip x={relative.x} y={relative.y} placement="top">
          ({relative.x.toFixed(1)}, {relative.y.toFixed(1)})
        </Tooltip>
        <Tooltip x={10} y={15} placement="bottom">
          (10, 15)
        </Tooltip>
        <Tooltip x={relative.x + 10} y={relative.y + 15} placement="bottom">
          ({(relative.x + 10).toFixed(1)}, {(relative.y + 15).toFixed(1)})
        </Tooltip>
        <CursorPoint
          style={{ x: absolute.x, y: absolute.y }}
          animate={absoluteControls}
          transition={{ type: "spring", bounce: 0 }}
        />
        <CursorPoint
          style={{ x: relative.x, y: relative.y }}
          animate={relativeControls}
          transition={{ type: "spring", bounce: 0 }}
        />
      </Svg>
      <Controls>
        <button
          className="bg-gray2 p-2 rounded-xl shadow-md border border-gray8"
          onClick={() => {
            setRelative({ x: 15, y: 5 });
            setAbsolute({ x: 5, y: 5 });
          }}
        >
          <Refresh />
        </button>
      </Controls>
    </>
  );
};

// --

const commands = parsePath(
  "M 5 8 q 2 2 0 4 m 3 -6 q 4 4 0 8 m 3 -10 q 4 6 0 12"
);

const MoveCommand = () => {
  const { data } = useStateContext<{ active: number } | null>(
    "command-list-move"
  );
  const isHovering = typeof data?.active === "number";
  return (
    <Svg size={20}>
      <g>
        {commands.map((command, index) => {
          const isPlaceholder = isHovering && data?.active !== index;
          const getClassName = () => {
            if (command.code !== "M") return;
            if (!isHovering) return "stroke-gray10";
            if (isPlaceholder) return "stroke-gray8";
            return "stroke-gray12";
          };
          return (
            <g key={command.id} className={isPlaceholder && "text-gray8"}>
              <PathSection command={command} className={getClassName()} />
            </g>
          );
        })}
      </g>
      <g>
        {commands.map((command, index) => {
          const isPlaceholder = isHovering && data?.active !== index;
          return (
            <g key={command.id} className={isPlaceholder && "text-gray8"}>
              <PathSectionPoint command={command} />
            </g>
          );
        })}
      </g>
    </Svg>
  );
};

// --

const points = [
  [0, 5],
  [5, 15],
  [10, 10],
  [15, 10],
  [20, 0],
];

const Practice = () => {
  const { data } = useStateContext<{ value: string }>("editor");
  const [path, setPath] = React.useState<Command[]>([]);

  React.useEffect(() => {
    try {
      const parsed = parsePath(data?.value);
      setPath(parsed);
    } catch {}
  }, [data?.value]);

  const lastCommand = path.at(-1);
  return (
    <Svg size={20}>
      {points.map(([x, y], index) => {
        return (
          <AnimatedEndpoint
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            delay={index * 0.2}
          />
        );
      })}
      <PathVisualizer path={path} />
      {lastCommand && (
        <CursorPoint
          animate={{ x: lastCommand.x, y: lastCommand.y }}
          transition={{ type: "spring", bounce: 0 }}
        />
      )}
    </Svg>
  );
};

// --

const mapIndexToComponent = [
  CursorOverview,
  Corner,
  AbsoluteRelative,
  MoveCommand,
  Practice,
];

export function Cursors() {
  const { index } = useIndexContext();
  const Component = mapIndexToComponent[index];
  if (!Component) return null;
  return <Component />;
}
