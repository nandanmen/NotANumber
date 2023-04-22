"use client";

import React from "react";
import { motion, useAnimationControls } from "framer-motion";
import { useInterval } from "~/lib/use-interval";
import { PathVisualizer, Sections, Text } from "../components/path-visualizer";
import { Svg, useSvgContext } from "../components/svg";
import { heart } from "../index/index";
import { useIndexContext } from "../components/index-provider";
import { Tooltip } from "../components/svg/tooltip";
import { parsePath, type Command } from "../utils";
import { useStateContext } from "./state-context";
import { useDebouncedCallback } from "use-debounce";

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
    <div className="w-full">
      <Svg size={size}>
        <PathVisualizer path={commands} index={index} />
        <CursorPoint
          animate={{ x: currentCommand.x, y: currentCommand.y }}
          transition={{ type: "spring", bounce: 0 }}
        />
      </Svg>
      <div className="absolute bottom-24 right-24 flex gap-1">
        <button
          className="bg-gray2 p-2 rounded-xl shadow-md border border-gray8"
          onClick={play}
        >
          {playing ? <Pause /> : <Play />}
        </button>
      </div>
    </div>
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
    <div className="w-full">
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
      <div className="absolute bottom-24 right-24 flex gap-1">
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
      </div>
    </div>
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
    <div className="w-full">
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
      <div className="absolute bottom-24 right-24">
        <button
          className="bg-gray2 p-2 rounded-xl shadow-md border border-gray8"
          onClick={() => {
            setRelative({ x: 15, y: 5 });
            setAbsolute({ x: 5, y: 5 });
          }}
        >
          <Refresh />
        </button>
      </div>
    </div>
  );
};

const Refresh = () => {
  return (
    <svg
      width="32"
      height="32"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    >
      <path d="M11.25 4.75L8.75 7L11.25 9.25" />
      <path d="M12.75 19.25L15.25 17L12.75 14.75" />
      <path d="M9.75 7H13.25C16.5637 7 19.25 9.68629 19.25 13V13.25" />
      <path d="M14.25 17H10.75C7.43629 17 4.75 14.3137 4.75 11V10.75" />
    </svg>
  );
};

const Pause = () => {
  return (
    <svg
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    >
      <path d="M15.25 6.75V17.25" />
      <path d="M8.75 6.75V17.25" />
    </svg>
  );
};

const Play = () => {
  return (
    <svg
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    >
      <path d="M18.25 12L5.75 5.75V18.25L18.25 12Z" />
    </svg>
  );
};

const ArrowRight = () => {
  return (
    <svg
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    >
      <path d="M13.75 6.75L19.25 12L13.75 17.25" />
      <path d="M19 12H4.75" />
    </svg>
  );
};

const ArrowLeft = () => {
  return (
    <svg
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    >
      <path d="M10.25 6.75L4.75 12L10.25 17.25" />
      <path d="M19.25 12H5" />
    </svg>
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
