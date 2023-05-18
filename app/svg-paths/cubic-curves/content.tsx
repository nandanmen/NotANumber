"use client";

import React from "react";
import { motion, transform } from "framer-motion";
import { MDX } from "../components/mdx";
import {
  Endpoint,
  PathVisualizer,
  Text,
  toPath,
} from "../components/path-visualizer";
import { StateProvider, useStateContext } from "../components/state-context";
import { useSvgContext } from "../components/svg";
import { VisualWrapper } from "../components/visual-wrapper";
import { PathHoverVisual } from "../components/path-hover-visual";
import { parsePath } from "../utils";
import { CommandHighlight } from "./components";

const pillCommands = parsePath("M 5 5 h 5 q 5 2.5 0 5 h -5 q -5 -2.5 0 -5 z");
const pillCommandsCorrected = parsePath(
  "M 5 5 h 5 c 4 0 4 5 0 5 h -5 c -4 0 -4 -5 0 -5 z"
);

export function Content({ content, length }) {
  return (
    <StateProvider initial={{}}>
      <MDX
        content={content}
        numSections={length}
        components={{ CommandHighlight }}
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
          ]}
        />
      </MDX>
    </StateProvider>
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
  return <motion.line transition={{ type: "spring", bounce: 0 }} {...props} />;
}

function Point({ x, y }: { x: number; y: number }) {
  const { getRelative } = useSvgContext();
  return (
    <motion.circle
      animate={{ cx: x, cy: y }}
      r={getRelative(1)}
      transition={{ type: "spring", bounce: 0 }}
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
          transition={{ type: "spring", bounce: 0 }}
          className="stroke-blue11"
          animate={{
            d: quadratic
              ? "M 10 5 c 4 0 4 5 0 5"
              : "M 10 5 c 3.3 1.7 3.3 3.3 0 5",
          }}
        />
        <motion.path
          transition={{ type: "spring", bounce: 0 }}
          className="stroke-blue11"
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
