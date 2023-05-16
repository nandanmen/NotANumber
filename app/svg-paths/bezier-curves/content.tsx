"use client";

import React from "react";
import { motion, transform } from "framer-motion";
import { MDX } from "../components/mdx";
import {
  Endpoint,
  PathVisualizer,
  toPath,
} from "../components/path-visualizer";
import { StateProvider, useStateContext } from "../components/state-context";
import { useSvgContext } from "../components/svg";
import { CoordinatesTooltip } from "../components/svg/tooltip";
import { VisualWrapper } from "../components/visual-wrapper";
import { parsePath } from "../utils";
import { RoundedCornerCommands, TCommandList } from "./rounded-corner-commands";

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
      }}
    >
      <MDX
        content={content}
        numSections={length}
        components={{ RoundedCornerCommands, TCommandList }}
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
          ]}
        />
      </MDX>
    </StateProvider>
  );
}

function CurvePlayground() {
  return (
    <>
      <Curve path="M 5 7 q 5 -3 10 0" />
      <Curve path="M 5 13 c 5 -3 5 3 10 0" />
    </>
  );
}

function Curve({ path }) {
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
      <g>
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
          }}
        />
        <DraggableEndpoint
          cx={command.x1}
          cy={command.y1}
          onPan={(x, y) => {
            setCommand({ ...command, x1: x, y1: y });
          }}
        />
        {command.code === "C" && (
          <DraggableEndpoint
            cx={command.x2}
            cy={command.y2}
            onPan={(x, y) => {
              setCommand({ ...command, x2: x, y2: y });
            }}
          />
        )}
      </g>
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

function DraggableEndpoint({
  cx,
  cy,
  onPan,
}: {
  cx: number;
  cy: number;
  onPan: (x: number, y: number) => void;
}) {
  const [active, setActive] = React.useState(false);
  const { size, getRelative } = useSvgContext();
  return (
    <motion.g className="cursor-pointer" whileHover="active">
      <motion.circle
        r={getRelative(1)}
        className="fill-blue9"
        cx={cx}
        cy={cy}
        animate={active && "active"}
        variants={{
          active: {
            r: getRelative(2),
          },
        }}
      />
      <Endpoint
        cx={cx}
        cy={cy}
        onPanStart={() => setActive(true)}
        onPan={(_, info) => {
          const { width, x, y } = document
            .querySelector("[data-x-axis-lines]")
            .getBoundingClientRect();
          const relativeX = info.point.x - x;
          const relativeY =
            info.point.y - y - document.documentElement.scrollTop;
          const transformer = transform([0, width], [0, size]);
          const newX = transformer(relativeX);
          const newY = transformer(relativeY);
          onPan(newX, newY);
        }}
        onPanEnd={() => setActive(false)}
      />
    </motion.g>
  );
}
