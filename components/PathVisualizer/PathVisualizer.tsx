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
import { heart } from "../paths/templates";
import { useBackgroundContext } from "~/components/PathPlayground";

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
  highlight: string[];
}>(null);

export const Arcs = () => {
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

const mapTypeToCommands = {
  M: "move",
  L: "line",
  H: "line",
  V: "line",
  C: "curve",
  S: "curve",
  Q: "curve",
  T: "curve",
  A: "arc",
  Z: "line",
};

const getIsHidden = (code: string, highlight: string[]) => {
  if (highlight.includes("move")) return false;
  if (!highlight.length) return false;
  const type = mapTypeToCommands[code.toUpperCase()];
  return !highlight.includes(type);
};

export const PathSections = () => {
  const { activeCommands, commands, config, highlight } = React.useContext(
    PathVisualizerContext
  );
  const hasHighlight = highlight.length > 0;
  return (
    <g>
      {activeCommands.map((command, index) => {
        const lastCursor = getCursorAtIndex(commands, index - 1);
        const isHidden = getIsHidden(command.code, highlight);
        const path = toPath(command);
        return (
          <Path
            key={path + index}
            d={`M ${lastCursor.x} ${lastCursor.y} ${path}`}
          />
        );
      })}
    </g>
  );
};

export const Path = ({ isHidden = false, ...props }) => {
  const { size } = useBackgroundContext();
  return (
    <_Path
      strokeWidth={size / 100}
      animate={{ pathLength: 1, opacity: isHidden ? 0 : 1 }}
      initial={{ pathLength: 0 }}
      transition={{ pathLength: { duration: 1 } }}
      {...props}
    />
  );
};

const _Path = styled(motion.path, {
  stroke: "$gray12",
  fill: "none",
});

export const Lines = () => {
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
              <BezierCurveLines
                pointA={{
                  x1: command.x1,
                  y1: command.y1,
                  x2: lastCursor.x,
                  y2: lastCursor.y,
                }}
                pointB={{
                  x1: command.x1,
                  y1: command.y1,
                  x2: command.x,
                  y2: command.y,
                }}
              />
            );
          case "C":
            return (
              <BezierCurveLines
                pointA={{
                  x1: command.x1,
                  y1: command.y1,
                  x2: lastCursor.x,
                  y2: lastCursor.y,
                }}
                pointB={{
                  x1: command.x2,
                  y1: command.y2,
                  x2: command.x,
                  y2: command.y,
                }}
              />
            );
          case "c":
            return (
              <BezierCurveLines
                pointA={{
                  x1: command.x1 + lastCursor.x,
                  y1: command.y1 + lastCursor.y,
                  x2: lastCursor.x,
                  y2: lastCursor.y,
                }}
                pointB={{
                  x1: command.x2 + lastCursor.x,
                  y1: command.y2 + lastCursor.y,
                  x2: command.x + lastCursor.x,
                  y2: command.y + lastCursor.y,
                }}
              />
            );
          default:
            return null;
        }
      })}
    </g>
  );
};

const BezierCurveLines = ({ pointA, pointB }) => {
  const { highlight } = React.useContext(PathVisualizerContext);
  const isHidden = highlight.length > 0 && !highlight.includes("curve");
  return (
    <Group color="blue" animate={{ opacity: isHidden ? 0 : 1 }}>
      <AnimatableLine {...pointA} />
      <AnimatableLine {...pointB} />
    </Group>
  );
};

export const Endpoints = () => {
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
                <CurveEndpoint cx={command.x1} cy={command.y1} shadow />
                <CurveEndpoint
                  cx={command.x}
                  cy={command.y}
                  shadow
                  delay={0.25}
                />
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

export function PathProvider({
  commands,
  activeIndex = commands.length - 1,
  highlight = [],
  children,
}) {
  const config = useBackgroundContext();
  const activeCommands = commands.slice(0, activeIndex + 1);
  return (
    <PathVisualizerContext.Provider
      value={{
        config,
        commands,
        activeCommands,
        highlight,
      }}
    >
      {children}
    </PathVisualizerContext.Provider>
  );
}

export function usePathContext() {
  const ctx = React.useContext(PathVisualizerContext);
  if (!ctx)
    throw new Error("usePathContext must be used within a PathProvider");
  return ctx;
}

export function PathVisualizer({
  size = 30,
  commands = defaultCommands,
  activeIndex = commands.length - 1,
}) {
  return (
    <PathProvider commands={commands} activeIndex={activeIndex}>
      <g>
        <Arcs />
        <Lines />
        <PathSections />
        <Endpoints />
      </g>
    </PathProvider>
  );
}

const Move = ({
  x1,
  y1,
  x2,
  y2,
  ...props
}: React.ComponentPropsWithoutRef<typeof Line>) => {
  const { config, highlight } = React.useContext(PathVisualizerContext);
  const isHidden = highlight.length > 0 && !highlight.includes("move");
  return (
    <Group color="red" animate={{ opacity: isHidden ? 0 : 1 }}>
      <Line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        strokeDasharray={config.endpointSize / 1.2}
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

export const AnimatableLine = (
  props: React.ComponentPropsWithoutRef<typeof _Line>
) => {
  return (
    <Line
      animate={{ pathLength: 1 }}
      initial={{ pathLength: 0 }}
      transition={{ duration: 1 }}
      {...props}
    />
  );
};

export const Line = (
  props: React.ComponentPropsWithoutRef<typeof _Line> & {
    small?: boolean;
    dashed?: boolean;
  }
) => {
  const { config } = React.useContext(PathVisualizerContext);
  return (
    <_Line
      strokeWidth={config.endpointSize / (props.small ? 3 : 2)}
      strokeDasharray={
        props.dashed
          ? `${config.endpointSize} ${config.endpointSize / 1.5}`
          : undefined
      }
      {...props}
    />
  );
};

const _Line = styled(motion.line, {
  stroke: "currentColor",
});

const CurveEndpoint = (
  props: React.ComponentPropsWithoutRef<typeof Endpoint>
) => {
  return <Endpoint type="curve" color="blue" {...props} />;
};

const LineEndpoint = (
  props: React.ComponentPropsWithoutRef<typeof Endpoint>
) => {
  return <Endpoint type="line" color="yellow" {...props} />;
};

const MoveEndpoint = (
  props: React.ComponentPropsWithoutRef<typeof Endpoint>
) => {
  return <Endpoint type="move" color="red" {...props} />;
};

export const Endpoint = (
  props: React.ComponentPropsWithoutRef<typeof _Endpoint> & {
    small?: boolean;
    shadow?: boolean;
    color?: "red" | "blue" | "yellow" | "green";
    delay?: number;
    type?: "curve" | "move" | "line";
  }
) => {
  const { cx, cy, delay = 0 } = props;
  const { config, highlight } = React.useContext(PathVisualizerContext);
  const { endpointSize, padding } = useBackgroundContext();
  const id = React.useId();
  const isHidden = highlight.length > 0 && !highlight.includes(props.type);

  if (props.shadow) {
    return (
      <Group color={props.color}>
        <mask id={id}>
          <rect
            x={-padding}
            y={-padding}
            width="100%"
            height="100%"
            fill="white"
          />
          <motion.circle
            cx={cx}
            cy={cy}
            r={endpointSize * 1.25}
            animate={{ r: endpointSize * 7 }}
            transition={{ type: "spring", damping: 20, delay }}
            initial={{ r: endpointSize * 1.25 }}
            fill="black"
          />
        </mask>
        <motion.circle
          fill="currentColor"
          cx={cx}
          cy={cy}
          r={endpointSize * 6}
          mask={`url('#${id}')`}
          animate="shown"
          initial="hidden"
          variants={{
            hidden: { scale: 0.5, opacity: 0 },
            shown: { scale: 1, opacity: 1 },
          }}
          transition={{ type: "spring", damping: 10, stiffness: 150, delay }}
        />
        <_Endpoint
          cx={cx}
          cy={cy}
          animate="shown"
          initial="hidden"
          variants={{
            hidden: { scale: 0.5, opacity: 0 },
            shown: { scale: 1, opacity: 1 },
          }}
          transition={{ type: "spring", damping: 10, stiffness: 150, delay }}
          as={motion.circle}
          strokeWidth={config.strokeWidth}
          r={props.small ? config.endpointSize * 0.75 : config.endpointSize}
          hidden={isHidden}
        />
      </Group>
    );
  }

  return (
    <Group color={props.color}>
      <_Endpoint
        as={motion.circle}
        strokeWidth={config.strokeWidth}
        r={props.small ? config.endpointSize * 0.75 : config.endpointSize}
        transition={{ duration: 1 }}
        hidden={isHidden}
        {...props}
      />
    </Group>
  );
};

const Group = styled(motion.g, {
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

const _Endpoint = styled(motion.circle, {
  stroke: "$gray12",
  fill: "$$color",
  variants: {
    hidden: {
      true: {
        opacity: 0,
      },
    },
  },
});
