/* eslint-disable react/jsx-key */
"use client";

import React from "react";
import { motion } from "framer-motion";
import { MDX } from "../components/mdx";
import { StateProvider } from "../components/state-context";
import { useSvgContext } from "../components/svg";
import { Endpoint } from "../components/path-visualizer";
import { CoordinatesTooltip } from "../components/svg/tooltip";
import { PathHoverVisual } from "../components/path-hover-visual";
import { HeartCommands, ClosePathToggle } from "./components";
import { PracticeQuestion } from "../components/path-practice";
import { initialState, useStateContext } from "./state";
import { VisualWrapper } from "../components/visual-wrapper";
import { Path } from "../components/svg/path";
import { DraggableEndpoint } from "../components/draggable-endpoint";
import { getDragHandlers } from "../components/svg/drag-group";
import { Circle } from "../components/svg/circle";
import clsx from "clsx";
import { Line } from "../components/svg/line";
import { Text } from "../components/svg/text";

export function LinesContent({ content, length }) {
  return (
    <StateProvider initial={initialState}>
      <MDX
        content={content}
        numSections={length}
        components={{
          HeartCommands,
          ClosePathToggle,
          AbsoluteLine,
          RelativeLine,
          ZExample,
          HeartPath,
          Heart,
          PracticeQuestion,
        }}
      >
        <VisualWrapper
          components={[
            {
              svg: 20,
              children: <AbsoluteLine />,
            },
            {
              children: (
                <>
                  <AbsoluteLine placeholder />
                  <RelativeLine />
                </>
              ),
            },
            {
              svg: 20,
              children: <PathHoverVisual source="vertical" />,
            },
            {
              svg: 20,
              children: <ZExample />,
            },
            {
              svg: 24,
              children: <HeartPath />,
            },
            {
              svg: {
                size: 10,
                config: { pan: { x: 7, y: 3 } },
              },
              children: <Heart />,
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

function ZExample() {
  const { data } = useStateContext("closePath");
  const { useRelativeMotionValue } = useSvgContext();
  return (
    <g>
      <Path d={data.path.toPathString()} />
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

function AbsoluteLine({ placeholder = false }) {
  const { data: absoluteData, set: setAbsolute } = useStateContext("absolute");
  const { data: relativeData, set: setRelative } = useStateContext("relative");
  const absolute = absoluteData.path.atAbsolute<"L">(1);

  return (
    <g className={clsx(placeholder && "text-gray10")}>
      <Path d={absoluteData.path.toPathString()} />
      <Circle variant="cursor" cx={absolute.x0} cy={absolute.y0} />
      {placeholder ? (
        <Circle variant="point" cx={absolute.x} cy={absolute.y} />
      ) : (
        <DraggableEndpoint
          cx={absolute.x}
          cy={absolute.y}
          {...getDragHandlers({
            id: ["1.x", "1.y"],
            state: absoluteData.state,
            set: setAbsolute,
          })}
          onPan={(x, y) => {
            setAbsolute({ path: absoluteData.path.setAbsolute(1, { x, y }) });
            setRelative({ path: relativeData.path.set(1, { x, y }) });
          }}
        />
      )}
      <CoordinatesTooltip x={absolute.x} y={absolute.y} />
    </g>
  );
}

function RelativeLine() {
  const { data: absoluteData, set: setAbsolute } = useStateContext("absolute");
  const { data: relativeData, set: setRelative } = useStateContext("relative");
  const relative = relativeData.path.atAbsolute<"L">(1);
  const absolute = absoluteData.path.atAbsolute<"L">(1);
  return (
    <g>
      <g className="text-gray10">
        <Line
          x1={relative.x0}
          y1={relative.y0}
          x2={relative.x0}
          y2={relative.y}
        />
        <Line
          x1={relative.x0}
          y1={relative.y}
          x2={relative.x}
          y2={relative.y}
        />
        <Circle
          variant="cursor"
          cx={relative.x0}
          cy={relative.y}
          size="small"
        />
        <Text y={relative.y} x={(relative.x - relative.x0) / 2 + relative.x0}>
          {(relative.x - relative.x0).toFixed(1)}
        </Text>
        <Text x={relative.x0} y={(relative.y - relative.y0) / 2 + relative.y0}>
          {(relative.y - relative.y0).toFixed(1)}
        </Text>
      </g>
      <Path
        d={relativeData.path.toPathString()}
        animate={{ pathLength: 1 }}
        initial={{ pathLength: 0 }}
        transition={{ type: "spring", duration: 1 }}
      />
      <Circle variant="cursor" cx={relative.x0} cy={relative.y0} />
      <DraggableEndpoint
        cx={relative.x}
        cy={relative.y}
        {...getDragHandlers({
          id: ["1.x", "1.y"],
          state: relativeData.state,
          set: setRelative,
        })}
        onPan={(x, y) => {
          setRelative({ path: relativeData.path.setAbsolute(1, { x, y }) });
          setAbsolute({
            path: absoluteData.path.setAbsolute(1, {
              x: x - relative.x0,
              y: y - relative.y0,
            }),
          });
        }}
      />
      <CoordinatesTooltip x={relative.x} y={relative.y} />
      <CoordinatesTooltip x={absolute.x} y={absolute.y} />
    </g>
  );
}

function HeartPath({ withZ = false, ...props }) {
  return (
    <Path
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
