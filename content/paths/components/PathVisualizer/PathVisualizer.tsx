import React from "react";
import { motion } from "framer-motion";
import {
  svgArcToCenterParam,
  getCursorAtIndex,
  toPath,
  parse,
  type Command,
} from "./utils";
import { styled } from "~/stitches.config";

const code = `M 20 20
v 20
m 30 0
v -20
M 10 50
Q 40 70 65 50`;

const print = `M12 11
c0 3.517-1.099 6.799-2.753 9.571
m-3.44-2.041.054-.09
A13.916 13.916 0 008 11
a4 4 0 118 0
c0 1.017-.07 2.019-.203 3
m-2.118 6.844
A21.88 21.88 0 0015.171 17
m3.839 1.132
c.645-2.266.99-4.659.99-7.132
A8 8 0 008 4.07
M3 15.364
c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4`;

const heart = `M11.995 7.23319
C10.5455 5.60999 8.12832 5.17335 6.31215 6.65972
C4.4959 8.14609 4.2403 10.6312 5.66654 12.3892
L11.995 18.25
L18.3235 12.3892
C19.7498 10.6312 19.5253 8.13046 17.6779 6.65972
C15.8305 5.18899 13.4446 5.60999 11.995 7.23319
Z`;

const ENDPOINT_SCALE_FACTOR = 68;

const defaultCommands = parse(heart);

type Config = {
  size: number;
  endpointSize: number;
  strokeWidth: number;
};

const PathVisualizerContext = React.createContext<{
  commands: Command[];
  activeCommands: Command[];
  config: Config;
}>(null);

const Arcs = () => {
  const { activeCommands, commands, config } = React.useContext(
    PathVisualizerContext
  );
  return (
    <g>
      {activeCommands.map((command, index) => {
        const lastCursor = getCursorAtIndex(commands, index - 1);
        switch (command.code) {
          case "A":
          case "a": {
            const { code, command: _command, relative, ...args } = command;
            const { cx, cy } = svgArcToCenterParam(
              lastCursor.x,
              lastCursor.y,
              command.rx,
              command.ry,
              command.xAxisRotation,
              command.largeArc,
              command.sweep,
              relative ? lastCursor.x + command.x : command.x,
              relative ? lastCursor.y + command.y : command.y
            );
            return (
              <Ellipse
                cx={cx}
                cy={cy}
                rx={command.rx}
                ry={command.ry}
                strokeWidth={config.strokeWidth}
              />
            );
          }
        }
      })}
    </g>
  );
};

const Ellipse = styled("ellipse", {
  stroke: "$gray8",
  fill: "none",
});

const PathSections = () => {
  const { activeCommands, commands, config } = React.useContext(
    PathVisualizerContext
  );
  return (
    <g>
      {activeCommands.map((command, index) => {
        const lastCursor = getCursorAtIndex(commands, index - 1);
        const path = toPath(command);
        console.log(path);
        return (
          <Path
            key={path + index}
            d={`M ${lastCursor.x} ${lastCursor.y} ${path}`}
            strokeWidth={config.size / 100}
            animate={{ pathLength: 1 }}
            initial={{ pathLength: 0 }}
            transition={{ duration: 1 }}
          />
        );
      })}
    </g>
  );
};

const Path = styled(motion.path, {
  stroke: "$gray12",
  fill: "none",
});

const Lines = () => {
  const { activeCommands } = React.useContext(PathVisualizerContext);
  return (
    <g>
      {activeCommands.map((command, index, arr) => {
        const lastCursor = getCursorAtIndex(arr, index - 1);
        switch (command.code) {
          case "M":
            return <Move x1={0} y1={0} x2={command.x} y2={command.y} />;
          case "m":
            return (
              <Move
                x1={lastCursor.x}
                y1={lastCursor.y}
                x2={lastCursor.x + command.x}
                y2={lastCursor.y + command.y}
              />
            );
          case "Q":
            return (
              <Group color="blue">
                <AnimatableLine
                  x1={command.x1}
                  y1={command.y1}
                  x2={lastCursor.x}
                  y2={lastCursor.y}
                />
                <AnimatableLine
                  x1={command.x1}
                  y1={command.y1}
                  x2={command.x}
                  y2={command.y}
                />
              </Group>
            );
          case "C":
            return (
              <Group color="blue">
                <AnimatableLine
                  x1={command.x1}
                  y1={command.y1}
                  x2={lastCursor.x}
                  y2={lastCursor.y}
                />
                <AnimatableLine
                  x1={command.x2}
                  y1={command.y2}
                  x2={command.x}
                  y2={command.y}
                />
              </Group>
            );
          case "c":
            return (
              <Group color="blue">
                <AnimatableLine
                  x1={command.x1 + lastCursor.x}
                  y1={command.y1 + lastCursor.y}
                  x2={lastCursor.x}
                  y2={lastCursor.y}
                />
                <AnimatableLine
                  x1={command.x2 + lastCursor.x}
                  y1={command.y2 + lastCursor.y}
                  x2={command.x + lastCursor.x}
                  y2={command.y + lastCursor.y}
                />
              </Group>
            );
          default:
            return null;
        }
      })}
    </g>
  );
};

const Endpoints = () => {
  const { activeCommands } = React.useContext(PathVisualizerContext);
  return (
    <g>
      {activeCommands.map((command, index, arr) => {
        const lastCursor = getCursorAtIndex(arr, index - 1);
        switch (command.code) {
          case "M":
            return (
              <MoveEndpoint
                initial={{ cx: 0, cy: 0 }}
                animate={{ cx: command.x, cy: command.y }}
              />
            );
          case "m":
            return (
              <MoveEndpoint
                initial={{
                  cx: lastCursor.x,
                  cy: lastCursor.y,
                }}
                animate={{
                  cx: lastCursor.x + command.x,
                  cy: lastCursor.y + command.y,
                }}
              />
            );
          case "L":
            return (
              <LineEndpoint
                initial={{
                  cx: lastCursor.x,
                  cy: lastCursor.y,
                }}
                animate={{
                  cx: command.x,
                  cy: command.y,
                }}
              />
            );
          case "v":
            return (
              <LineEndpoint
                initial={{
                  cx: lastCursor.x,
                  cy: lastCursor.y,
                }}
                animate={{
                  cx: lastCursor.x,
                  cy: lastCursor.y + command.y,
                }}
              />
            );
          case "Q":
            return (
              <>
                <CurveEndpoint cx={command.x1} cy={command.y1} />
                <CurveEndpoint cx={command.x} cy={command.y} />
              </>
            );
          case "C":
            return (
              <>
                <CurveEndpoint cx={command.x1} cy={command.y1} />
                <CurveEndpoint cx={command.x2} cy={command.y2} />
                <CurveEndpoint cx={command.x} cy={command.y} />
              </>
            );
          case "c":
            return (
              <>
                <CurveEndpoint
                  cx={command.x1 + lastCursor.x}
                  cy={command.y1 + lastCursor.y}
                />
                <CurveEndpoint
                  cx={command.x2 + lastCursor.x}
                  cy={command.y2 + lastCursor.y}
                />
                <CurveEndpoint
                  cx={command.x + lastCursor.x}
                  cy={command.y + lastCursor.y}
                />
              </>
            );
          default:
            return null;
        }
      })}
    </g>
  );
};

export function PathVisualizer({
  size = 30,
  commands = defaultCommands,
  activeIndex = commands.length - 1,
}) {
  const activeCommands = commands.slice(0, activeIndex + 1);
  const endpointSize = size / ENDPOINT_SCALE_FACTOR;
  return (
    <PathVisualizerContext.Provider
      value={{
        config: { size, endpointSize, strokeWidth: endpointSize / 3 },
        commands,
        activeCommands,
      }}
    >
      <g>
        <Arcs />
        <PathSections />
        <Lines />
        <Endpoints />
      </g>
    </PathVisualizerContext.Provider>
  );
}

const Move = ({
  x1,
  y1,
  x2,
  y2,
  ...props
}: React.ComponentPropsWithoutRef<typeof Line>) => {
  const { config } = React.useContext(PathVisualizerContext);
  return (
    <Group color="red">
      <Line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        strokeDasharray={config.endpointSize}
        {...props}
      />
      <AnimatableLine
        x1={x2}
        y1={y2}
        x2={x1}
        y2={y1}
        strokeWidth={config.endpointSize / 2 + 1}
        css={{ stroke: "$gray4" }}
        animate={{ pathLength: 0 }}
        initial={{ pathLength: 1 }}
      />
    </Group>
  );
};

const AnimatableLine = (props: React.ComponentPropsWithoutRef<_Line>) => {
  return (
    <Line
      animate={{ pathLength: 1 }}
      initial={{ pathLength: 0 }}
      transition={{ duration: 1 }}
      {...props}
    />
  );
};

const Line = (props: React.ComponentPropsWithoutRef<_Line>) => {
  const { config } = React.useContext(PathVisualizerContext);
  return <_Line strokeWidth={config.endpointSize / 2} {...props} />;
};

const _Line = styled(motion.line, {
  stroke: "currentColor",
});

const CurveEndpoint = (
  props: React.ComponentPropsWithoutRef<typeof Endpoint>
) => {
  return <Endpoint color="blue" {...props} />;
};

const LineEndpoint = (
  props: React.ComponentPropsWithoutRef<typeof Endpoint>
) => {
  return <Endpoint color="yellow" {...props} />;
};

const MoveEndpoint = (
  props: React.ComponentPropsWithoutRef<typeof Endpoint>
) => {
  return <Endpoint color="red" {...props} />;
};

const Endpoint = (props: React.ComponentPropsWithoutRef<typeof _Endpoint>) => {
  const { config } = React.useContext(PathVisualizerContext);
  return (
    <_Endpoint
      as={motion.circle}
      strokeWidth={config.strokeWidth}
      r={config.endpointSize}
      transition={{ duration: 1 }}
      {...props}
    />
  );
};

const Group = styled("g", {
  $$color: "$colors$gray8",
  color: "$$color",
  variants: {
    color: {
      red: {
        $$color: "$colors$red8",
      },
      blue: {
        $$color: "$colors$blue8",
      },
      yellow: {
        $$color: "$colors$yellow8",
      },
      green: {
        $$color: "$colors$green8",
      },
    },
  },
});

const _Endpoint = styled(Group, {
  stroke: "$gray12",
  fill: "currentColor",
});
