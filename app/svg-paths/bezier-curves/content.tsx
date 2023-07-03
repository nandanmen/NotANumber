"use client";

import React from "react";
import { motion } from "framer-motion";
import { MDX } from "../components/mdx";
import { StateProvider } from "../components/state-context";
import { useSvgContext } from "../components/svg";
import { CoordinatesTooltip } from "../components/svg/tooltip";
import { VisualWrapper } from "../components/visual-wrapper";
import { AbsoluteArcCommand, parsePath } from "../lib/path";
import { PracticeQuestion } from "../components/path-practice";
import { DraggableEndpoint } from "../components/draggable-endpoint";
import { initialState, useStateContext } from "./state";
import { AbsoluteCommand } from "../lib/path";
import { Path } from "../components/svg/path";
import { Circle } from "../components/svg/circle";
import { Line } from "../components/svg/line";
import { Text } from "../components/svg/text";
import { getDragHandlers } from "../components/svg/drag-group";
import { useMediaQuery } from "../components/hooks/use-media-query";

export function Content({ content, length }) {
  return (
    <StateProvider initial={initialState}>
      <MDX
        content={content}
        numSections={length}
        components={{
          CurveTypes,
          CurvePlayground,
          RoundedCorner,
          Chain,
          PracticeQuestion,
        }}
      >
        <VisualWrapper
          components={[
            {
              children: <CurveTypes />,
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
              children: <PracticeQuestion />,
            },
          ]}
        />
      </MDX>
    </StateProvider>
  );
}

function CurveTypes() {
  const { data: path } = useStateContext("intro");
  return (
    <>
      <QuadraticBezierCurve command={path.atAbsolute(1)} />
      <CubicBezierCurve command={path.atAbsolute(3)} />
      <Arc command={path.atAbsolute(5)} />
    </>
  );
}

function QuadraticBezierCurve({ command }: { command: AbsoluteCommand<"Q"> }) {
  return (
    <g>
      <Line x1={command.x0} y1={command.y0} x2={command.x1} y2={command.y1} />
      <Line x1={command.x1} y1={command.y1} x2={command.x} y2={command.y} />
      <Circle cx={command.x1} cy={command.y1} />
      <Path d={command.toPathSection()} />
      <Circle cx={command.x0} cy={command.y0} variant="cursor" />
      <Circle cx={command.x} cy={command.y} variant="cursor" />
    </g>
  );
}

function CubicBezierCurve({ command }: { command: AbsoluteCommand<"C"> }) {
  return (
    <g>
      <g>
        <Line x1={command.x0} y1={command.y0} x2={command.x1} y2={command.y1} />
        <Circle cx={command.x1} cy={command.y1} />
      </g>
      <g>
        <Line x1={command.x} y1={command.y} x2={command.x2} y2={command.y2} />
        <Circle cx={command.x2} cy={command.y2} />
      </g>
      <Path d={command.toPathSection()} />
      <Circle cx={command.x0} cy={command.y0} variant="cursor" />
      <Circle cx={command.x} cy={command.y} variant="cursor" />
    </g>
  );
}

function Arc({ command }: { command: AbsoluteArcCommand }) {
  return (
    <g>
      <Circle cx={command.cx} cy={command.cy} />
      <Line x1={command.cx} y1={command.cy} x2={command.x} y2={command.y} />
      <Line
        x1={command.cx}
        y1={command.cy}
        x2={command.cx}
        y2={command.cy + command.ry}
      />
      <Path d={command.toPathSection()} />
      <Circle cx={command.x0} cy={command.y0} variant="cursor" />
      <Circle cx={command.x} cy={command.y} variant="cursor" />
    </g>
  );
}

function CurvePlayground() {
  const [showDrag, setShowDrag] = React.useState(true);
  const isMobile = useMediaQuery("(max-width: 768px)");
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
        {showDrag && !isMobile && (
          <motion.g
            variants={{
              active: { y: 0, opacity: 1 },
              idle: { y: 1, opacity: 0 },
            }}
          >
            <Text x="7" y="2" fontSize={3} className="fill-current stroke-none">
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

function Curve({ path: pathString, onChange = () => {} }) {
  const [path, setPath] = React.useState(() => parsePath(pathString));
  const { useRelativeMotionValue } = useSvgContext();
  const command = path.atAbsolute<"Q" | "C">(1);

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
        <line x1={command.x0} y1={command.y0} x2={command.x1} y2={command.y1} />
        <line x1={command.x} y1={command.y} x2={x2} y2={y2} />
      </motion.g>
      <motion.path
        d={command.toPathSection()}
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
          setPath(path.setAbsolute(1, { x, y }));
          onChange?.();
        }}
      />
      <DraggableEndpoint
        cx={command.x1}
        cy={command.y1}
        onPan={(x, y) => {
          setPath(path.setAbsolute(1, { x1: x, y1: y }));
          onChange?.();
        }}
      />
      {command.code === "C" && (
        <DraggableEndpoint
          cx={command.x2}
          cy={command.y2}
          onPan={(x, y) => {
            setPath(path.setAbsolute(1, { x2: x, y2: y }));
            onChange?.();
          }}
        />
      )}
    </motion.g>
  );
}

function RoundedCorner() {
  const {
    data: { path, state },
    set,
  } = useStateContext("curve");
  const { x1, y1, x, y, x0, y0 } = path.atAbsolute<"Q">(2);
  return (
    <g>
      <Line x1={x0} y1={y0} x2={x1} y2={y1} />
      <Line x1={x} y1={y} x2={x1} y2={y1} />
      <Path
        d={path.toPathString()}
        animate={{ pathLength: 1 }}
        initial={{ pathLength: 0 }}
        transition={{ type: "spring", duration: 1 }}
      />
      <g>
        <Circle cx={x0} cy={y0} variant="cursor" />
        <DraggableEndpoint
          cx={x}
          cy={y}
          onPan={(x, y) => set({ path: path.setAbsolute(2, { x, y }) })}
          {...getDragHandlers({
            id: ["2.x", "2.y"],
            state,
            set,
          })}
        />
        <DraggableEndpoint
          cx={x1}
          cy={y1}
          onPan={(x, y) => set({ path: path.setAbsolute(2, { x1: x, y1: y }) })}
          {...getDragHandlers({
            id: ["2.x1", "2.y1"],
            state,
            set,
          })}
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
  const {
    data: { path, state },
    set,
  } = useStateContext("chain");

  const q = path.atAbsolute<"Q">(1);
  const t = path.atAbsolute<"T">(2);
  const { x: tx, y: ty } = getReflection(q.x1, q.y1, q.x, q.y);
  const normal = getPerpendicular(q.x1, q.y1, q.x, q.y);

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
      <Line x1={q.x0} y1={q.y0} x2={q.x1} y2={q.y1} />
      <Line x1={q.x} y1={q.y} x2={q.x1} y2={q.y1} />
      <Line x1={q.x} y1={q.y} x2={tx} y2={ty} dashed />
      <Line x1={tx} y1={ty} x2={t.x} y2={t.y} dashed />
      <Line
        stroke={`url(#${id})`}
        x1={normal.x0}
        y1={normal.y0}
        x2={normal.x}
        y2={normal.y}
        variant="none"
      />
      <Path d={path.toPathString()} />
      <g>
        <Circle cx={q.x0} cy={q.y0} variant="cursor" />
        <Circle cx={tx} cy={ty} />
        <DraggableEndpoint
          cx={q.x}
          cy={q.y}
          onPan={(x, y) => set({ path: path.setAbsolute(1, { x, y }) })}
          {...getDragHandlers({
            id: ["1.x", "1.y"],
            state,
            set,
          })}
        />
        <DraggableEndpoint
          cx={q.x1}
          cy={q.y1}
          onPan={(x, y) => set({ path: path.setAbsolute(1, { x1: x, y1: y }) })}
          {...getDragHandlers({
            id: ["1.x1", "1.y1"],
            state,
            set,
          })}
        />
        <DraggableEndpoint
          cx={t.x}
          cy={t.y}
          onPan={(x, y) => set({ path: path.setAbsolute(2, { x, y }) })}
          {...getDragHandlers({
            id: ["2.x", "2.y"],
            state,
            set,
          })}
        />
      </g>
      <CoordinatesTooltip x={q.x1} y={q.y1} placement="left" />
      <CoordinatesTooltip x={tx} y={ty} placement="right" />
      <CoordinatesTooltip x={t.x} y={t.y} placement="bottom" />
    </g>
  );
}
