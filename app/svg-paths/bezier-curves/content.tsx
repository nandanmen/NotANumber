"use client";

import React from "react";
import { motion, transform } from "framer-motion";
import { MDX } from "../components/mdx";
import {
  Endpoint,
  PathVisualizer,
  toPath,
} from "../components/path-visualizer";
import { StateProvider } from "../components/state-context";
import { useSvgContext } from "../components/svg";
import { CoordinatesTooltip } from "../components/svg/tooltip";
import { VisualWrapper } from "../components/visual-wrapper";
import { parsePath, useEditableCommand } from "../utils";

export function Content({ content, length }) {
  return (
    <StateProvider initial={{}}>
      <MDX content={content} numSections={length}>
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
  const { commands, get, set } = useEditableCommand(
    "M 5 0 v 5 Q 5 15 15 15 h 5"
  );
  const { useRelativeMotionValue } = useSvgContext();
  const curveCommand = get<"Q">(2);
  return (
    <g>
      <motion.g
        className="stroke-gray10"
        strokeWidth={useRelativeMotionValue(0.5)}
      >
        <line
          x1={curveCommand.x0}
          y1={curveCommand.y0}
          x2={curveCommand.x1}
          y2={curveCommand.y1}
        />
        <line
          x1={curveCommand.x}
          y1={curveCommand.y}
          x2={curveCommand.x1}
          y2={curveCommand.y1}
        />
      </motion.g>
      <motion.g
        strokeWidth={useRelativeMotionValue(1.2)}
        stroke="currentColor"
        fill="none"
      >
        {commands.map((command) => {
          return <path key={command.id} d={toPath(command)} />;
        })}
      </motion.g>
      <g>
        <motion.circle
          r={useRelativeMotionValue(1.2)}
          fill="currentColor"
          cx={curveCommand.x0}
          cy={curveCommand.y0}
        />
        <DraggableEndpoint
          cx={curveCommand.x}
          cy={curveCommand.y}
          onPan={(x, y) => set<"Q">(2, { x, y })}
        />
        <DraggableEndpoint
          cx={curveCommand.x1}
          cy={curveCommand.y1}
          onPan={(x, y) => set<"Q">(2, { x1: x, y1: y })}
        />
      </g>
      <CoordinatesTooltip
        x={curveCommand.x}
        y={curveCommand.y}
        placement="bottom"
      />
      <CoordinatesTooltip
        x={curveCommand.x1}
        y={curveCommand.y1}
        placement="bottom"
      />
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
