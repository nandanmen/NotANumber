/* eslint-disable react/jsx-key */
"use client";

import React from "react";
import { motion } from "framer-motion";
import { MDX } from "../components/mdx";
import { StateProvider } from "../components/state-context";
import { useIndexContext } from "../components/index-provider";
import { Svg, useSvgContext } from "../components/svg";
import { Endpoint, PathVisualizer, Text } from "../components/path-visualizer";
import { parsePath } from "../lib/path";
import { CoordinatesTooltip } from "../components/svg/tooltip";
import { PathHoverVisual } from "../components/path-hover-visual";
import { HeartCommands, ClosePathToggle } from "./components";
import { PracticeQuestion } from "../components/path-practice";
import { Path } from "../components/path";
import { initialState, useStateContext } from "./state";

const mapIndexToSize = [
  20,
  25,
  20,
  20,
  25,
  { size: 10, config: { pan: { x: 7, y: 3 } } },
  25,
];

export function LinesContent({ content, length }) {
  return (
    <StateProvider initial={initialState}>
      <MDX
        content={content}
        numSections={length}
        components={{ HeartCommands, ClosePathToggle }}
      >
        <LineVisuals />
      </MDX>
    </StateProvider>
  );
}

const commands = parsePath("M 13 5 h -6 V 15 H 13 M 7 10 h 4");

const mapIndexToComponent = [
  <Line index={0} />,
  <Line index={1} />,
  <PathHoverVisual commands={[]} id="command-list-lines" />,
  <ZExample />,
  <HeartPath />,
  <Heart />,
  <PracticeQuestion />,
];

function ZExample() {
  const { useRelativeMotionValue } = useSvgContext();
  return (
    <g>
      <PathVisualizer path="M 10 5 l -5 10 h 10 Z" helpers={false} />
      <motion.line
        x1="15"
        y1="15"
        x2="10"
        y2="5"
        strokeWidth={useRelativeMotionValue(1.2)}
        className="stroke-blue9"
      />
      <Endpoint cx={15} cy={15} />
      <g className="text-blue9">
        <Endpoint cx={10} cy={5} />
      </g>
      <Text x="13" y="9" fontSize={4} className="fill-blue9 stroke-none">
        Z
      </Text>
    </g>
  );
}

function LineVisuals() {
  const { index } = useIndexContext();
  const children = mapIndexToComponent[index];
  if (!children) return <Svg size={25} />;

  let props: any = mapIndexToSize[index];
  if (typeof props === "number") props = { size: props };
  return <Svg {...props}>{children}</Svg>;
}

function Line({ index }) {
  const { data: absolute } = useStateContext("L");
  const { data: relative } = useStateContext("l");

  const absolutePath = React.useMemo(() => {
    return `M 5 5 L ${absolute.x} ${absolute.y}`;
  }, [absolute.x, absolute.y]);

  const relativePath = React.useMemo(() => {
    return `M 5 5 l ${relative.x} ${relative.y}`;
  }, [relative.x, relative.y]);

  return (
    <>
      <PathVisualizer path={absolutePath} />
      <CoordinatesTooltip x={absolute.x} y={absolute.y} />
      {index && (
        <>
          <PathVisualizer path={relativePath} />
          <CoordinatesTooltip x={5 + relative.x} y={5 + relative.y} />
        </>
      )}
    </>
  );
}

function HeartPath({ withZ = false, ...props }) {
  return (
    <Path
      className="stroke-current"
      d={`M11.995 7.23319
C10.5455 5.60999 8.12832 5.17335 6.31215 6.65972
C4.4959 8.14609 4.2403 10.6312 5.66654 12.3892
L11.995 18.25
L18.3235 12.3892
C19.7498 10.6312 19.5253 8.13046 17.6779 6.65972
C15.8305 5.18899 13.4446 5.60999 11.995 7.23319
${withZ ? "Z" : ""}`}
      {...props}
    />
  );
}

function Heart() {
  const { useRelativeMotionValue } = useSvgContext();
  const { data } = useStateContext("z");
  return (
    <>
      <HeartPath withZ={data.active} strokeWidth={0.3} />
      <motion.circle
        cx="12"
        cy="7.2"
        strokeWidth={useRelativeMotionValue(1.5)}
        r={useRelativeMotionValue(8)}
        className="stroke-blue9"
        fill="none"
        animate={{ pathLength: 1 }}
        initial={{ pathLength: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
    </>
  );
}
