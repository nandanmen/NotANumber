"use client";

import React from "react";
import {
  parseSVG,
  makeAbsolute,
  type CommandMadeAbsolute,
  type Command as CommandBase,
} from "svg-path-parser";
import { useSvgContext } from "./svg";
import { getArcCenter } from "./utils";
import { motion } from "framer-motion";
import { v4 } from "uuid";

type Command = CommandMadeAbsolute & { id: string };

const getColor = (code: Command["code"]) => {
  if (code === "A") return "text-blue10";
  if (["L", "H", "V"].includes(code)) return "text-green10";
  if (["C", "S", "Q", "T"].includes(code)) return "text-cyan10";
  return "text-gray10";
};

const toPath = (command: Command) => {
  const {
    code,
    x0,
    y0,
    command: _command,
    relative: _relative,
    ...rest
  } = command;
  if (code === "Z") {
    return `M ${x0} ${y0} Z`;
  }
  if (code === "H") {
    return `M ${x0} ${y0} H ${command.x}`;
  }
  if (code === "V") {
    return `M ${x0} ${y0} V ${command.y}`;
  }
  if (code === "A") {
    return `M ${x0} ${y0} A ${command.rx} ${command.ry} ${
      command.xAxisRotation
    } ${command.largeArc ? 1 : 0} ${command.sweep ? 1 : 0} ${command.x} ${
      command.y
    }`;
  }
  return `M ${x0} ${y0} ${code} ${Object.values(rest).join(" ")}`;
};

type CommandType = "cursor" | "curve" | "arc" | "line";

const mapCodeToType = (code: Command["code"]): CommandType => {
  if (code === "A") return "arc";
  if (["L", "H", "V"].includes(code)) return "line";
  if (["C", "S", "Q", "T"].includes(code)) return "curve";
  return "cursor";
};

const PathContext = React.createContext<{
  commands: Command[];
}>(null);

export function usePathContext() {
  return React.useContext(PathContext);
}

export function PathVisualizer({
  path,
  index,
  type,
  helpers = true,
}: {
  path: string | CommandBase[];
  index?: number;
  type?: CommandType;
  helpers?: boolean;
}) {
  const commands = React.useMemo(() => {
    if (Array.isArray(path)) return path;
    return parseSVG(path);
  }, [path]);

  const absoluteCommands = React.useMemo(() => {
    makeAbsolute(commands);
    return commands.map((command) => ({
      ...command,
      id: v4(),
    }));
  }, [commands]) as Command[];

  const activeCommands = absoluteCommands.filter((command, i) => {
    if (!type && typeof index !== "number") return true;
    if (typeof index === "number") return i <= index;
    return mapCodeToType(command.code) === type;
  });

  return (
    <g>
      <PathContext.Provider
        value={{
          commands: absoluteCommands,
        }}
      >
        <g className="text-gray8">
          <Sections type="placeholder" />
        </g>
      </PathContext.Provider>
      <PathContext.Provider
        value={{
          commands: activeCommands,
        }}
      >
        <g>
          {helpers && (
            <>
              <Arcs />
              <Lines />
              <Endpoints />
            </>
          )}
          <Sections />
        </g>
      </PathContext.Provider>
    </g>
  );
}

const Sections = ({ type }: { type?: "placeholder" }) => {
  const { getRelative } = useSvgContext();
  const { commands } = usePathContext();
  return (
    <g>
      <circle cx="0" cy="0" r={getRelative(1)} className="fill-gray10" />
      <g>
        {commands.map((command) => {
          if (command.code === "M") {
            return (
              <line
                key={command.id}
                x1={command.x0}
                y1={command.y0}
                x2={command.x}
                y2={command.y}
                strokeDasharray={getRelative(1)}
                strokeWidth={getRelative(0.5)}
                className="stroke-gray10"
              />
            );
          }
          return (
            <motion.path
              key={command.id}
              d={toPath(command)}
              className="fill-none stroke-current"
              strokeWidth={getRelative(1)}
              animate={{ pathLength: 1 }}
              initial={{ pathLength: type === "placeholder" ? 1 : 0 }}
              transition={{ type: "spring", bounce: 0 }}
            />
          );
        })}
      </g>
      <g>
        {commands.map((command, i) => {
          if (command.code === "Z") return null;
          if (type === "placeholder")
            return <Endpoint key={command.id} cx={command.x} cy={command.y} />;
          return (
            <AnimatedEndpoint key={command.id} cx={command.x} cy={command.y} />
          );
        })}
      </g>
    </g>
  );
};

const AnimatedEndpoint = ({ cx, cy, delay = 0 }) => {
  const id = React.useId();
  const { config, getRelative } = useSvgContext();
  const padding = getRelative(config.padding);
  const endpointSize = getRelative(1);
  return (
    <g>
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
        className="fill-gray12"
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
      <Endpoint
        cx={cx}
        cy={cy}
        animate="shown"
        initial="hidden"
        variants={{
          hidden: { scale: 0.5, opacity: 0 },
          shown: { scale: 1, opacity: 1 },
        }}
        transition={{ type: "spring", damping: 10, stiffness: 150, delay }}
      />
    </g>
  );
};

const Endpoint = ({ cx, cy, ...props }) => {
  const { config, getRelative } = useSvgContext();
  const endpointSize = getRelative(1);
  const strokeWidth = getRelative(0.6);
  return (
    <motion.circle
      className="fill-gray4 stroke-current"
      cx={cx}
      cy={cy}
      strokeWidth={strokeWidth}
      r={endpointSize}
      {...props}
    />
  );
};

const Arcs = () => {
  const { getRelative } = useSvgContext();
  const { commands } = usePathContext();
  return (
    <g strokeWidth={getRelative(0.5)}>
      {commands.map((command, index) => {
        switch (command.code) {
          case "A": {
            const { cx, cy } = getArcCenter(command);
            return (
              <ellipse
                key={command.id}
                cx={cx}
                cy={cy}
                rx={command.rx}
                ry={command.ry}
                fill="none"
                className="stroke-current"
              />
            );
          }
        }
      })}
    </g>
  );
};

const Lines = () => {
  const { getRelative } = useSvgContext();
  const { commands } = usePathContext();
  return (
    <g strokeWidth={getRelative(0.5)} className="stroke-gray10">
      {commands.map((command, index) => {
        switch (command.code) {
          case "M": {
            return (
              <line
                key={command.id}
                x1={command.x0}
                y1={command.y0}
                x2={command.x}
                y2={command.y}
                strokeDasharray={getRelative(1)}
              />
            );
          }
          case "L": {
            const height = command.y - command.y0;
            const width = command.x - command.x0;
            return (
              <g>
                <line
                  x1={command.x0}
                  y1={command.y0}
                  x2={command.x0}
                  y2={command.y}
                />
                <line
                  x1={command.x0}
                  y1={command.y}
                  x2={command.x}
                  y2={command.y}
                />
                <Text x={command.x0} y={height / 2 + command.y0}>
                  {height.toFixed(1)}
                </Text>
                <Text y={command.y} x={width / 2 + command.x0}>
                  {width.toFixed(1)}
                </Text>
              </g>
            );
          }
          case "Q": {
            return (
              <g key={command.id}>
                <line
                  x1={command.x0}
                  y1={command.y0}
                  x2={command.x1}
                  y2={command.y1}
                />
                <line
                  x1={command.x1}
                  y1={command.y1}
                  x2={command.x}
                  y2={command.y}
                />
              </g>
            );
          }
          case "C": {
            return (
              <g key={command.id}>
                <line
                  x1={command.x0}
                  y1={command.y0}
                  x2={command.x1}
                  y2={command.y1}
                />
                <line
                  x1={command.x2}
                  y1={command.y2}
                  x2={command.x}
                  y2={command.y}
                />
              </g>
            );
          }
        }
      })}
    </g>
  );
};

export const Text = ({ children, ...props }) => {
  const { getRelative } = useSvgContext();
  const fontSize = getRelative(2);
  return (
    <g
      fontSize={fontSize}
      textAnchor="middle"
      dominantBaseline="middle"
      fontWeight="bold"
      className="font-mono"
    >
      <text strokeWidth={getRelative(0.5)} className="stroke-gray4" {...props}>
        {children}
      </text>
      <text className="fill-gray10 stroke-none" {...props}>
        {children}
      </text>
    </g>
  );
};

const Endpoints = () => {
  const { getRelative } = useSvgContext();
  const { commands } = usePathContext();
  return (
    <g>
      {commands.map((command, i) => {
        return (
          <g key={command.id}>
            <CommandEndpoint command={command} />
          </g>
        );
      })}
    </g>
  );
};

const CommandEndpoint = ({ command }: { command: Command }) => {
  const { getRelative } = useSvgContext();
  switch (command.code) {
    case "M": {
      if (!command.x0 && !command.y0) {
        return (
          <circle cx="0" cy="0" r={getRelative(1)} className="fill-gray10" />
        );
      }
    }
    case "L": {
      return (
        <>
          <circle
            cx={command.x0}
            cy={command.y}
            r={getRelative(0.8)}
            className="fill-gray10"
          />
        </>
      );
    }
    case "C": {
      return (
        <>
          <circle
            cx={command.x1}
            cy={command.y1}
            r={getRelative(0.8)}
            className="fill-gray10"
          />
          <circle
            cx={command.x2}
            cy={command.y2}
            r={getRelative(0.8)}
            className="fill-gray10"
          />
        </>
      );
    }
    default:
      return null;
  }
};
