"use client";

import React from "react";
import { motion, useAnimationControls } from "framer-motion";
import {
  AnimatedEndpoint,
  PathVisualizer,
} from "../components/path-visualizer";
import { useSvgContext } from "../components/svg";
import { CoordinatesTooltip, Tooltip } from "../components/svg/tooltip";
import { useStateContext } from "./state";
import { useDebouncedCallback } from "use-debounce";
import { PathHoverVisual } from "../components/path-hover-visual";
import { PracticeQuestion } from "../components/path-practice";
import { VisualWrapper } from "../components/visual-wrapper";
import { DraggableEndpoint } from "../components/draggable-endpoint";
import { getDragHandlers } from "../components/svg/drag-group";
import { Path } from "../components/svg/path";
import { Circle } from "../components/svg/circle";
import { Line } from "../components/svg/line";
import { Text } from "../components/svg/text";

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

export const AbsoluteRelative = ({ showRelative = false }) => {
  const { data: absoluteData, set: setAbsolute } = useStateContext("absolute");
  const { data: relativeData, set: setRelative } = useStateContext("relative");

  const absolute = absoluteData.path.atAbsolute<"L">(1);
  const relative = relativeData.path.atAbsolute<"L">(1);

  const absoluteControls = useAnimationControls();
  const animateAbsolute = useDebouncedCallback(() => {
    absoluteControls.start({
      x: absolute.x,
      y: absolute.y,
    });
  }, 1000);

  React.useEffect(() => {
    absoluteControls.start({
      x: absolute.x0,
      y: absolute.y0,
      transition: { type: false },
    });
    animateAbsolute();
  }, [absoluteControls, animateAbsolute, absolute.x0, absolute.y0]);

  const relativeControls = useAnimationControls();
  const animateRelative = useDebouncedCallback(() => {
    relativeControls.start({
      x: relative.x,
      y: relative.y,
    });
  }, 1000);
  React.useEffect(() => {
    if (showRelative) {
      relativeControls.start({
        x: relative.x0,
        y: relative.y0,
        transition: { type: false },
      });
      animateRelative();
    }
  }, [
    relativeControls,
    animateRelative,
    relative.x0,
    relative.y0,
    showRelative,
  ]);

  return (
    <>
      <g>
        <Path d={absoluteData.path.toPathString()} />
        <DraggableEndpoint
          cx={absolute.x0}
          cy={absolute.y0}
          {...getDragHandlers({
            id: ["0.x", "0.y"],
            state: absoluteData.state,
            set: setAbsolute,
          })}
          onPan={(x, y) => {
            setAbsolute({ path: absoluteData.path.setAbsolute(0, { x, y }) });
          }}
        />
        <Circle variant="cursor" cx={absolute.x} cy={absolute.y} />
      </g>
      <CoordinatesTooltip x={absolute.x0} y={absolute.y0} placement="top" />
      <CoordinatesTooltip x={absolute.x} y={absolute.y} placement="bottom" />
      <CursorPoint
        style={{ x: absolute.x0, y: absolute.y0 }}
        animate={absoluteControls}
        transition={{ type: "spring", bounce: 0 }}
      />
      {showRelative && (
        <g>
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
            className="fill-gray10"
          />
          <Text x={relative.x0} y={relative.y0 + relative.source.y / 2}>
            {relative.source.y.toFixed(1)}
          </Text>
          <Text y={relative.y} x={relative.x0 + relative.source.x / 2}>
            {relative.source.x.toFixed(1)}
          </Text>
          <Path d={relativeData.path.toPathString()} />
          <DraggableEndpoint
            cx={relative.x0}
            cy={relative.y0}
            {...getDragHandlers({
              id: ["0.x", "0.y"],
              state: relativeData.state,
              set: setRelative,
            })}
            onPan={(x, y) => {
              setRelative({ path: relativeData.path.setAbsolute(0, { x, y }) });
            }}
          />
          <Circle variant="cursor" cx={relative.x} cy={relative.y} />
          <CoordinatesTooltip x={relative.x0} y={relative.y0} placement="top" />
          <CoordinatesTooltip
            x={relative.x}
            y={relative.y}
            placement="bottom"
          />
          <CursorPoint
            style={{ x: relative.x0, y: relative.y0 }}
            animate={relativeControls}
            transition={{ type: "spring", bounce: 0 }}
          />
        </g>
      )}
    </>
  );
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
          svg: 20,
          children: <AbsoluteRelative />,
        },
        {
          svg: 30,
          children: <AbsoluteRelative showRelative />,
        },
        {
          svg: 15,
          children: <PathHoverVisual source="move" />,
        },
        {
          svg: 20,
          children: <Practice />,
        },
      ]}
    />
  );
}
