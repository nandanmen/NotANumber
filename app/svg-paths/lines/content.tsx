"use client";

import { MDX } from "../components/mdx";
import { StateProvider, useStateContext } from "../components/state-context";
import { useIndexContext } from "../components/index-provider";
import { Svg } from "../components/svg";
import { PathVisualizer } from "../components/path-visualizer";
import { parsePath } from "../utils";
import { Tooltip } from "../components/svg/tooltip";

export function LinesContent({ content, length }) {
  return (
    <StateProvider
      initial={{
        L: { x: 15, y: 15 },
      }}
    >
      <MDX content={content} numSections={length}>
        <LineVisuals />
      </MDX>
    </StateProvider>
  );
}

// eslint-disable-next-line react/jsx-key
const mapIndexToComponent = [<Line index={0} />, <Line index={1} />];

function LineVisuals() {
  const { index } = useIndexContext();
  const children = mapIndexToComponent[index];
  if (!children) return null;
  return children;
}

function Line({ index }) {
  return (
    <Svg size={index ? 30 : 20}>
      <SingleLine />
    </Svg>
  );
}

function SingleLine() {
  const {
    data: { x, y },
    set,
  } = useStateContext<{ x: number; y: number }>("L");
  const path = parsePath(`M 5 5 L ${x} ${y}`);
  return (
    <>
      <PathVisualizer path={path} />
      <Tooltip x={x} y={y} placement="top">
        ({x.toFixed(1)}, {y.toFixed(1)})
      </Tooltip>
    </>
  );
}
