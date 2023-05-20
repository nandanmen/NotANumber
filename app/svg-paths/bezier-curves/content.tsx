"use client";

import React from "react";
import { motion } from "framer-motion";
import { MDX } from "../components/mdx";
import { PathVisualizer, Text, toPath } from "../components/path-visualizer";
import { StateProvider, useStateContext } from "../components/state-context";
import { useSvgContext } from "../components/svg";
import { CoordinatesTooltip } from "../components/svg/tooltip";
import { VisualWrapper } from "../components/visual-wrapper";
import { parsePath } from "../utils";
import {
  RoundedCornerCommands,
  TCommandList,
  BezierCurveQuestion,
} from "./components";
import { PathPractice } from "../components/path-practice";
import { PathHoverVisual } from "../components/path-hover-visual";
import { DraggableEndpoint } from "../components/draggable-endpoint";

export function Content({ content, length }) {
  return (
    <StateProvider
      initial={{
        curve: {
          x1: 5,
          y1: 15,
          x: 15,
          y: 15,
        },
        chain: {
          x1: 5,
          y1: 10,
          x: 10,
          y: 10,
          tx: 15,
          ty: 15,
        },
        answer: {
          active: false,
        },
      }}
    >
      <MDX
        content={content}
        numSections={length}
        components={{
          RoundedCornerCommands,
          TCommandList,
          BezierCurveQuestion,
        }}
      >
        <VisualWrapper
          components={[
            {
              children: (
                <>
                  <PathVisualizer path="M 5 5 q 5 -3 10 0" />
                  <PathVisualizer path="M 5 10 c 5 -3 5 3 10 0" />
                  <PathVisualizer path="M 5 15 a 5 3 0 0 0 10 0" />
                </>
              ),
              svg: 20,
            },
            {
              children: <CurvePlayground />,
              svg: 20,
            },
            {
              children: <RoundedCorner />,
              svg: 20,
            },
            {
              children: <Chain />,
              svg: 20,
            },
            {
              children: <Practice />,
            },
          ]}
        />
      </MDX>
    </StateProvider>
  );
}

const frameCommands = parsePath(
  "M 5 17 Q 10 8 15 17 M 10 12.5 Q 15 5 20 12.5 M 5 5 v 15 h 15 v -15 z"
);

function Practice() {
  const { data } = useStateContext<{ active: boolean }>("answer");
  const { useRelativeMotionValue } = useSvgContext();
  return (
    <g>
      <motion.path
        strokeWidth={useRelativeMotionValue(2)}
        className="stroke-gray8"
        fill="none"
        d="M 5 17 Q 10 8 15 17 M 10 12.5 Q 15 5 20 12.5 M 5 5 v 15 h 15 v -15 z"
      />
      <PathPractice id="bezier-curve-practice" />
      {data.active && (
        <PathHoverVisual
          commands={frameCommands}
          id="command-list-bezier-curve-answers"
        />
      )}
    </g>
  );
}

function CurvePlayground() {
  const [showDrag, setShowDrag] = React.useState(true);
  const { getRelative } = useSvgContext();
  return (
    <>
      <motion.g
        animate="active"
        initial="idle"
        transition={{ staggerChildren: 0.1 }}
      >
        <Curve path="M 5 7 q 5 -3 10 0" onChange={() => setShowDrag(false)} />
        <Curve
          path="M 5 13 c 5 -3 5 3 10 0"
          onChange={() => setShowDrag(false)}
        />
        {showDrag && (
          <motion.g
            variants={{
              active: { y: 0, opacity: 1 },
              idle: { y: 1, opacity: 0 },
            }}
          >
            <Text
              x="7"
              y="2"
              font="font-draw"
              fontSize={3}
              className="fill-current stroke-none"
            >
              Drag me!
            </Text>
            <path
              d="M 8.7 2 q 1 0 1.3 1.5"
              fill="none"
              strokeWidth={getRelative(0.6)}
              stroke="currentColor"
            />
            <circle cx="10" cy="3.5" r={getRelative(0.5)} />
            <circle cx="8.7" cy="2" r={getRelative(0.5)} />
          </motion.g>
        )}
      </motion.g>
    </>
  );
}

function Curve({ path, onChange = () => {} }) {
  const [command, setCommand] = React.useState(() => parsePath(path)[1]);
  const { useRelativeMotionValue } = useSvgContext();

  if (command.code === "Q" || command.code === "C") {
    let x2 = command.x1;
    let y2 = command.y1;
    if (command.code === "C") {
      x2 = command.x2;
      y2 = command.y2;
    }
    return (
      <motion.g
        variants={{ active: { y: 0, opacity: 1 }, idle: { y: 1, opacity: 0 } }}
      >
        <motion.g
          className="stroke-gray10"
          strokeWidth={useRelativeMotionValue(0.5)}
        >
          <line
            x1={command.x0}
            y1={command.y0}
            x2={command.x1}
            y2={command.y1}
          />
          <line x1={command.x} y1={command.y} x2={x2} y2={y2} />
        </motion.g>
        <motion.path
          d={toPath(command)}
          strokeWidth={useRelativeMotionValue(1.2)}
          stroke="currentColor"
          fill="none"
        />
        <motion.circle
          r={useRelativeMotionValue(1.2)}
          fill="currentColor"
          cx={command.x0}
          cy={command.y0}
        />
        <DraggableEndpoint
          cx={command.x}
          cy={command.y}
          onPan={(x, y) => {
            setCommand({ ...command, x, y });
            onChange?.();
          }}
        />
        <DraggableEndpoint
          cx={command.x1}
          cy={command.y1}
          onPan={(x, y) => {
            setCommand({ ...command, x1: x, y1: y });
            onChange?.();
          }}
        />
        {command.code === "C" && (
          <DraggableEndpoint
            cx={command.x2}
            cy={command.y2}
            onPan={(x, y) => {
              setCommand({ ...command, x2: x, y2: y });
              onChange?.();
            }}
          />
        )}
      </motion.g>
    );
  }

  throw new Error(`Invalid command code: ${command.code}`);
}

function RoundedCorner() {
  const {
    data: { x1, y1, x, y },
    set,
  } = useStateContext<{
    x1: number;
    y1: number;
    x: number;
    y: number;
  }>("curve");
  const { useRelativeMotionValue } = useSvgContext();
  return (
    <g>
      <motion.g
        className="stroke-gray10"
        strokeWidth={useRelativeMotionValue(0.5)}
      >
        <line x1="5" y1="5" x2={x1} y2={y1} />
        <line x1={x} y1={y} x2={x1} y2={y1} />
      </motion.g>
      <motion.path
        strokeWidth={useRelativeMotionValue(1.2)}
        stroke="currentColor"
        fill="none"
        d={`M 5 0 v 5 Q ${x1} ${y1} ${x} ${y} h 5`}
        animate={{ pathLength: 1 }}
        initial={{ pathLength: 0 }}
        transition={{ type: "spring", duration: 1 }}
      />
      <g>
        <motion.circle
          r={useRelativeMotionValue(1.2)}
          fill="currentColor"
          cx="5"
          cy="5"
        />
        <DraggableEndpoint cx={x} cy={y} onPan={(x, y) => set({ x, y })} />
        <DraggableEndpoint
          cx={x1}
          cy={y1}
          onPan={(x, y) => set({ x1: x, y1: y })}
        />
      </g>
      <CoordinatesTooltip x={x} y={y} placement="bottom" />
      <CoordinatesTooltip x={x1} y={y1} placement="bottom" />
    </g>
  );
}

const getReflection = (x0: number, y0: number, x1: number, y1: number) => {
  const dx = x1 - x0;
  const dy = y1 - y0;
  return {
    x: x1 + dx,
    y: y1 + dy,
  };
};

const normalize = ([x, y]: [number, number]) => {
  const length = Math.sqrt(x * x + y * y);
  return [x / length, y / length];
};

const NORMAL_LENGTH = 3;

const getPerpendicular = (x0: number, y0: number, x1: number, y1: number) => {
  const dx = x1 - x0;
  const dy = y1 - y0;

  if (dy === 0) {
    return {
      x0: x1,
      y0: y1 - 3,
      x: x1,
      y: y1 - 3,
    };
  }

  const [xn, yn] = normalize([1, -dx / dy]).map((n) => n * NORMAL_LENGTH);
  const [xo, yo] = normalize([-1, dx / dy]).map((n) => n * NORMAL_LENGTH);

  return {
    x0: x1 + xo,
    y0: y1 + yo,
    x: x1 + xn,
    y: y1 + yn,
  };
};

function Chain() {
  const id = React.useId();

  const { data, set } = useStateContext<{
    x1: number;
    y1: number;
    x: number;
    y: number;
    tx: number;
    ty: number;
  }>("chain");
  const { useRelativeMotionValue } = useSvgContext();

  const { x: tx, y: ty } = getReflection(data.x1, data.y1, data.x, data.y);
  const normal = getPerpendicular(data.x1, data.y1, data.x, data.y);

  return (
    <g>
      <defs>
        <linearGradient
          id={id}
          x1={normal.x0}
          y1={normal.y0}
          x2={normal.x}
          y2={normal.y}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="transparent" />
          <stop offset="0.5" stopColor="currentColor" className="text-gray8" />
          <stop offset="1" stopColor="transparent" />
        </linearGradient>
      </defs>
      <motion.g
        className="stroke-gray10"
        strokeWidth={useRelativeMotionValue(0.5)}
      >
        <line x1="5" y1="5" x2={data.x1} y2={data.y1} />
        <line x1={data.x} y1={data.y} x2={data.x1} y2={data.y1} />
        <motion.g strokeDasharray={useRelativeMotionValue(1)}>
          <line x1={data.x} y1={data.y} x2={tx} y2={ty} />
          <line x1={tx} y1={ty} x2={data.tx} y2={data.ty} />
        </motion.g>
        <line
          stroke={`url(#${id})`}
          x1={normal.x0}
          y1={normal.y0}
          x2={normal.x}
          y2={normal.y}
        />
      </motion.g>
      <motion.path
        strokeWidth={useRelativeMotionValue(1.2)}
        stroke="currentColor"
        fill="none"
        d={`M 5 5 Q ${data.x1} ${data.y1} ${data.x} ${data.y} T ${data.tx} ${data.ty}`}
      />
      <g>
        <motion.circle
          r={useRelativeMotionValue(1.2)}
          fill="currentColor"
          cx="5"
          cy="5"
        />
        <motion.circle
          r={useRelativeMotionValue(1.2)}
          className="fill-gray10"
          cx={tx}
          cy={ty}
        />
        <DraggableEndpoint
          cx={data.x}
          cy={data.y}
          onPan={(x, y) => set({ x, y })}
        />
        <DraggableEndpoint
          cx={data.x1}
          cy={data.y1}
          onPan={(x, y) => set({ x1: x, y1: y })}
        />
        <DraggableEndpoint
          cx={data.tx}
          cy={data.ty}
          onPan={(x, y) => set({ tx: x, ty: y })}
        />
      </g>
      <CoordinatesTooltip x={data.x1} y={data.y1} placement="left" />
      <CoordinatesTooltip x={tx} y={ty} placement="right" />
      <CoordinatesTooltip x={data.tx} y={data.ty} placement="bottom" />
    </g>
  );
}
