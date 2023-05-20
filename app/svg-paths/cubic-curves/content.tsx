"use client";

import React from "react";
import { motion, transform } from "framer-motion";
import { MDX } from "../components/mdx";
import {
  AnimatedEndpoint,
  Endpoint,
  PathVisualizer,
  Text,
  toPath,
} from "../components/path-visualizer";
import { StateProvider, useStateContext } from "../components/state-context";
import { useSvgContext } from "../components/svg";
import { VisualWrapper } from "../components/visual-wrapper";
import { PathHoverVisual } from "../components/path-hover-visual";
import { type CommandWithCode, parsePath } from "../utils";
import { CommandHighlight, SyntaxExample } from "./components";
import { PathPractice } from "../components/path-practice";
import { CoordinatesTooltip } from "../components/svg/tooltip";
import type { SyntaxState } from "./types";

const pillCommands = parsePath("M 5 5 h 5 q 5 2.5 0 5 h -5 q -5 -2.5 0 -5 z");
const pillCommandsCorrected = parsePath(
  "M 5 5 h 5 c 4 0 4 5 0 5 h -5 c -4 0 -4 -5 0 -5 z"
);

export function Content({ content, length }) {
  return (
    <StateProvider<{ syntax: SyntaxState }>
      initial={{
        syntax: {
          state: "idle",
          active: null,
          x1: 0,
          y1: 5,
          x2: 20,
          y2: 5,
          x: 15,
          y: 13,
        },
      }}
    >
      <MDX
        content={content}
        numSections={length}
        components={{ CommandHighlight, SyntaxExample }}
      >
        <VisualWrapper
          components={[
            {
              children: <Pill />,
              svg: 15,
            },
            {
              children: <Pill quadratic />,
              svg: 15,
            },
            {
              children: <Syntax />,
              svg: 20,
            },
            {
              children: <Chain />,
              svg: 20,
            },
            {
              children: <Practice />,
              svg: 25,
            },
          ]}
        />
      </MDX>
    </StateProvider>
  );
}

function Syntax() {
  const { getRelative } = useSvgContext();
  const { data, set } = useStateContext<SyntaxState>("syntax");
  const { x1, y1, x2, y2, x, y, state } = data;

  const getHandlers = (name: SyntaxState["active"]) => {
    return {
      hoverStart: () => {
        if (state !== "idle") return;
        set({ state: "hovering", active: name });
      },
      hoverEnd: () => {
        if (state !== "hovering") return;
        set({ state: "idle", active: null });
      },
      panStart: () => {
        set({ state: "panning", active: name });
      },
      panEnd: () => {
        set({ state: "idle", active: null });
      },
    };
  };

  return (
    <g>
      <g className="stroke-gray10" strokeWidth={getRelative(0.75)}>
        <line x1={5} y1={13} x2={x1} y2={y1} />
        <line x1={x} y1={y} x2={x2} y2={y2} />
      </g>
      <motion.path
        d={`M 5 13 C ${x1} ${y1} ${x2} ${y2} ${x} ${y}`}
        strokeWidth={getRelative(1.25)}
        stroke="currentColor"
        fill="none"
        animate={{ pathLength: 1 }}
        initial={{ pathLength: 0 }}
        transition={{ type: "spring", bounce: 0 }}
      />
      <circle fill="currentColor" r={getRelative(1)} cx={5} cy={13} />
      <DraggableEndpoint
        cx={x1}
        cy={y1}
        on={{
          ...getHandlers("x1"),
          pan: (x, y) => set({ x1: x, y1: y }),
        }}
      />
      <DraggableEndpoint
        cx={x2}
        cy={y2}
        on={{
          ...getHandlers("x2"),
          pan: (x, y) => set({ x2: x, y2: y }),
        }}
      />
      <DraggableEndpoint
        cx={x}
        cy={y}
        on={{
          ...getHandlers("x"),
          pan: (x, y) => set({ x, y }),
        }}
      />
      <CoordinatesTooltip x={x1} y={y1} placement="right" />
      <CoordinatesTooltip x={x2} y={y2} placement="left" />
      <CoordinatesTooltip x={x} y={y} placement="bottom" />
    </g>
  );
}

const baloon =
  "M 6 10 c 0 -2 -2 -2 -2 -5 c 0 -5 7 -5 7 0 c 0 3 -2 3 -2 5 h -3 m 0.25 0 v 1.5 h -0.25 v 1 q 0 1 1 1 h 1 q 1 0 1 -1 v -1 h -3 m 2.75 0 v -1.5";

const parsedBaloon = parsePath(baloon);
const curves = parsedBaloon.filter((c) => c.code === "C") as Array<
  CommandWithCode<"C">
>;

function Chain() {
  const { getRelative } = useSvgContext();
  return (
    <g>
      <g>
        {curves.map((command) => {
          const { x1, y1, x2, y2, x, y, x0, y0 } = command;
          return (
            <motion.g
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              transition={{ delay: 0.8 }}
              className="text-gray10"
              key={command.id}
            >
              <line
                strokeWidth={getRelative(0.75)}
                stroke="currentColor"
                x1={x0}
                y1={y0}
                x2={x1}
                y2={y1}
              />
              <line
                strokeWidth={getRelative(0.75)}
                stroke="currentColor"
                x1={x}
                y1={y}
                x2={x2}
                y2={y2}
              />
              <circle
                fill="currentColor"
                r={getRelative(0.75)}
                cx={x1}
                cy={y1}
              />
              <circle
                fill="currentColor"
                r={getRelative(0.75)}
                cx={x2}
                cy={y2}
              />
            </motion.g>
          );
        })}
      </g>
      <motion.path
        strokeWidth={getRelative(1.25)}
        className="fill-none stroke-current"
        d={baloon}
        animate={{ pathLength: 1 }}
        initial={{ pathLength: 0 }}
        transition={{ duration: 1 }}
      />
      <g>
        {curves.map((command, index) => {
          const { x0, y0, x, y } = command;
          const last = index === curves.length - 1;
          return (
            <g key={command.id}>
              <AnimatedEndpoint cx={x0} cy={y0} delay={0.3 + index * 0.1} />
              {last && (
                <AnimatedEndpoint
                  cx={x}
                  cy={y}
                  delay={0.3 + index * 0.1 + 0.1}
                />
              )}
            </g>
          );
        })}
      </g>
    </g>
  );
}

function Practice() {
  const { data } = useStateContext<{ active: boolean }>("answer");
  const { useRelativeMotionValue } = useSvgContext();
  return (
    <g>
      <PathPractice id="practice" />
    </g>
  );
}

function getControlPoints(quadratic: boolean) {
  if (quadratic) {
    return {
      x1: 1,
      y1: 5,
      x2: 1,
      y2: 10,
      x3: 14,
      y3: 5,
      x4: 14,
      y4: 10,
    };
  }
  return {
    x1: 0,
    y1: 7.5,
    x2: 0,
    y2: 7.5,
    x3: 15,
    y3: 7.5,
    x4: 15,
    y4: 7.5,
  };
}

function Line(props: React.ComponentPropsWithoutRef<(typeof motion)["line"]>) {
  return (
    <motion.line transition={{ type: "spring", bounce: 0.2 }} {...props} />
  );
}

function Point({ x, y }: { x: number; y: number }) {
  const { getRelative } = useSvgContext();
  return (
    <motion.circle
      cx={x}
      cy={y}
      animate={{ cx: x, cy: y }}
      r={getRelative(1)}
      transition={{ type: "spring", bounce: 0.2 }}
    />
  );
}

const cmd = "M 10 5 c 3.3 1.7 3.3 3.3 0 5 h -5 c -3.3 -1.7 -3.3 -3.3 0 -5 z";
const cmd2 = "M 10 5 c 4 0 4 5 0 5 h -5 c -4 0 -4 -5 0 -5 z";

function Pill({ quadratic = false }) {
  const { getRelative } = useSvgContext();
  const { x1, y1, x2, y2, x3, y3, x4, y4 } = getControlPoints(quadratic);
  return (
    <g>
      <g strokeWidth={getRelative(0.75)} className="stroke-blue8">
        <Line animate={{ x1: 5, y1: 5, x2: x1, y2: y1 }} />
        <Line animate={{ x1: 5, y1: 10, x2: x2, y2: y2 }} />
        <Line animate={{ x1: 10, y1: 5, x2: x3, y2: y3 }} />
        <Line animate={{ x1: 10, y1: 10, x2: x4, y2: y4 }} />
      </g>
      <g className="fill-blue8">
        <Point x={x1} y={y1} />
        <Point x={x2} y={y2} />
        <Point x={x3} y={y3} />
        <Point x={x4} y={y4} />
      </g>
      <g strokeWidth={getRelative(1.25)} className="fill-none">
        <path d="M 5 5 h 5 M 5 10 h 5" className="stroke-current" />
        <motion.path
          transition={{ type: "spring", bounce: 0.2 }}
          className="stroke-blue11"
          d="M 10 5 c 3.3 1.7 3.3 3.3 0 5"
          animate={{
            d: quadratic
              ? "M 10 5 c 4 0 4 5 0 5"
              : "M 10 5 c 3.3 1.7 3.3 3.3 0 5",
          }}
        />
        <motion.path
          transition={{ type: "spring", bounce: 0.2 }}
          className="stroke-blue11"
          d="M 5 10 c -3.3 -1.7 -3.3 -3.3 0 -5"
          animate={{
            d: quadratic
              ? "M 5 10 c -4 0 -4 -5 0 -5"
              : "M 5 10 c -3.3 -1.7 -3.3 -3.3 0 -5",
          }}
        />
      </g>
      <g className="text-blue11">
        <Endpoint cx="5" cy="5" />
        <Endpoint cx="5" cy="10" />
        <Endpoint cx="10" cy="5" />
        <Endpoint cx="10" cy="10" />
      </g>
    </g>
  );
}

type EndpointEventHandlers = {
  panStart: () => void;
  pan: (x: number, y: number) => void;
  panEnd: () => void;
  hoverStart: () => void;
  hoverEnd: () => void;
};

function DraggableEndpoint({
  cx,
  cy,
  on,
}: {
  cx: number;
  cy: number;
  on: Partial<EndpointEventHandlers>;
}) {
  const [panning, setPanning] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const { size, getRelative } = useSvgContext();
  return (
    <motion.g
      className="cursor-pointer"
      onHoverStart={() => {
        if (panning) return;
        setActive(true);
        on.hoverStart?.();
      }}
      onHoverEnd={() => {
        if (panning) return;
        setActive(false);
        on.hoverEnd?.();
      }}
    >
      <motion.circle
        r={getRelative(1)}
        className="fill-blue9"
        cx={cx}
        cy={cy}
        animate={active ? "active" : "idle"}
        variants={{
          active: {
            r: getRelative(2),
          },
          idle: {
            r: getRelative(1),
          },
        }}
      />
      <Endpoint
        cx={cx}
        cy={cy}
        onPanStart={() => {
          on.panStart?.();
          setPanning(true);
          setActive(true);
        }}
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
          on.pan?.(newX, newY);
        }}
        onPanEnd={() => {
          on.panEnd?.();
          setPanning(false);
          setActive(false);
        }}
      />
    </motion.g>
  );
}
