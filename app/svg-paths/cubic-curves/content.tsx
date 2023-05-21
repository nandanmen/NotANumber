"use client";

import React from "react";
import { motion } from "framer-motion";
import { MDX } from "../components/mdx";
import { Endpoint } from "../components/path-visualizer";
import { StateProvider, useStateContext } from "../components/state-context";
import { useSvgContext } from "../components/svg";
import { VisualWrapper } from "../components/visual-wrapper";
import { SyntaxExample } from "./components/syntax-example";
import { ChainExample } from "./components/chain-example";
import { PathPractice } from "../components/path-practice";
import * as syntax from "./content/syntax";
import * as curveGeneral from "./content/curve-general";
import * as chain from "./content/chain";

export function Content({ content, length }) {
  return (
    <StateProvider
      initial={{
        syntax: syntax.initialState,
        chainDrag: chain.initialState,
      }}
    >
      <MDX
        content={content}
        numSections={length}
        components={{ SyntaxExample, ChainExample }}
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
            syntax.page,
            curveGeneral.page,
            chain.page,
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
