"use client";

import React from "react";
import { motion, useAnimationControls } from "framer-motion";
import {
  AnimatedEndpoint,
  PathVisualizer,
  Text,
} from "../components/path-visualizer";
import { useSvgContext } from "../components/svg";
import { Tooltip } from "../components/svg/tooltip";
import { parsePath } from "../utils";
import { useStateContext } from "./state";
import { useDebouncedCallback } from "use-debounce";
import { PathHoverVisual } from "../components/path-hover-visual";
import { PracticeQuestion } from "../components/path-practice";
import { VisualWrapper } from "../components/visual-wrapper";

export const CursorOverview = () => {
  const {
    data: { path, index },
  } = useStateContext("intro");
  const currentCommand = index === null ? null : path.atAbsolute(index);
  return (
    <>
      <PathVisualizer
        path={path.absolute}
        index={index}
        placeholder={index === null}
      />
      <CursorPoint
        animate={{ x: currentCommand?.x, y: currentCommand?.y }}
        transition={{ type: "spring", bounce: 0.2 }}
      />
    </>
  );
};

type CursorPointProps = React.ComponentPropsWithoutRef<(typeof motion)["g"]>;

const CursorPoint = (props: CursorPointProps) => {
  const { getRelative } = useSvgContext();
  return (
    <motion.g {...props}>
      <circle
        r={getRelative(1.3)}
        className="fill-blue9 stroke-current"
        strokeWidth={getRelative(0.6)}
      />
    </motion.g>
  );
};

// --

export const Corner = () => {
  const {
    data: { path, index, maxIndex },
  } = useStateContext("corner");
  const currentCommand = index === null ? null : path.atAbsolute(index);
  const showText = index === maxIndex - 1;
  return (
    <>
      <PathVisualizer
        path={path.absolute}
        index={index}
        helpers={false}
        placeholder={index === null}
      />
      <CursorPoint
        animate={{ x: currentCommand?.x, y: currentCommand?.y }}
        transition={{ type: "spring", bounce: 0.2 }}
      />
      {showText && (
        <motion.g
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          transition={{ delay: 0.5 }}
        >
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
    </>
  );
};

// --

const AbsoluteRelative = () => {
  const { data: absolute, set: setAbsolute } = useStateContext("absolute");
  const { data: relative, set: setRelative } = useStateContext("relative");

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
    </>
  );
};

// --

const commands = parsePath(
  "M 5 8 q 2 2 0 4 m 3 -6 q 4 4 0 8 m 3 -10 q 4 6 0 12"
);

const MoveCommand = () => {
  return <PathHoverVisual id="command-list-move" commands={[]} />;
};

// --

const points = [
  [0, 5],
  [5, 15],
  [10, 10],
  [15, 10],
  [20, 0],
];

export const Practice = () => {
  return (
    <>
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
      <PracticeQuestion />
    </>
  );
};

// --

export function Cursors() {
  return (
    <VisualWrapper
      components={[
        {
          children: <CursorOverview />,
        },
        {
          svg: 20,
          children: <Corner />,
        },
        {
          svg: 30,
          children: <AbsoluteRelative />,
        },
        {
          svg: 20,
          children: <MoveCommand />,
        },
        {
          svg: 20,
          children: <Practice />,
        },
      ]}
    />
  );
}
