"use client";

import React from "react";
import { useSvgContext } from "./svg";
import { motion } from "framer-motion";
import {
  AbsoluteArcCommand,
  AbsoluteCommand as Command,
  parsePath,
} from "../lib/path";
import { Text } from "./svg/text";

export const toPath = (command: Command) => {
  const {
    code,
    x0,
    y0,
    command: _command,
    relative: _relative,
    ...rest
  } = command;
  if (code === "Z") {
    return `M ${x0} ${y0} L ${command.x} ${command.y}`;
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
  if (code === "L") {
    return `M ${x0} ${y0} L ${command.x} ${command.y}`;
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
  placeholder = false,
}: {
  path: string | Command[];
  index?: number;
  type?: CommandType;
  helpers?: boolean;
  placeholder?: boolean;
}) {
  const _commands = React.useMemo(() => {
    if (typeof path === "string") return parsePath(path).absolute;
    return path;
  }, [path]);

  const activeCommands = _commands.filter((command, i) => {
    if (!type && typeof index !== "number") return true;
    if (typeof index === "number") return i <= index;
    return mapCodeToType(command.code) === type;
  });

  if (placeholder) {
    return (
      <PathContext.Provider
        value={{
          commands: _commands,
        }}
      >
        <g className="text-gray8">
          <Sections type="placeholder" />
        </g>
      </PathContext.Provider>
    );
  }

  return (
    <g>
      <PathContext.Provider
        value={{
          commands: _commands,
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

export const PathSectionPoint = ({
  command,
  type,
}: {
  command: Command;
  type?: "placeholder";
}) => {
  if (type === "placeholder") return <Endpoint cx={command.x} cy={command.y} />;
  return <AnimatedEndpoint cx={command.x} cy={command.y} />;
};

export const PathSection = ({
  command,
  type,
  ...props
}: {
  command: Command;
  type?: "placeholder";
} & React.ComponentPropsWithoutRef<"line">) => {
  const { getRelative } = useSvgContext();
  if (command.code === "M") {
    return (
      <line
        x1={command.x0}
        y1={command.y0}
        x2={command.x}
        y2={command.y}
        strokeDasharray={getRelative(1)}
        strokeWidth={getRelative(0.5)}
        className="stroke-gray10"
        {...props}
      />
    );
  }
  return (
    <motion.path
      d={toPath(command)}
      className="fill-none stroke-current"
      strokeWidth={getRelative(1)}
      animate={{ pathLength: 1 }}
      initial={{ pathLength: type === "placeholder" ? 1 : 0 }}
      transition={{ type: "spring", bounce: 0 }}
    />
  );
};

export const Sections = ({
  commands,
  type,
}: {
  commands?: Command[];
  type?: "placeholder";
}) => {
  const { getRelative } = useSvgContext();
  const pathContext = usePathContext();
  if (pathContext) commands = pathContext.commands;
  return (
    <g>
      <circle cx="0" cy="0" r={getRelative(1)} className="fill-gray10" />
      <g>
        {commands.map((command, i) => {
          return (
            <PathSection key={command.code + i} command={command} type={type} />
          );
        })}
      </g>
      <g>
        {commands.map((command, i) => {
          return (
            <PathSectionPoint
              key={command.code + i}
              command={command}
              type={type}
            />
          );
        })}
      </g>
    </g>
  );
};

export const AnimatedEndpoint = ({ cx, cy, delay = 0 }) => {
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

export const Endpoint = (
  props: React.ComponentPropsWithoutRef<(typeof motion)["circle"]>
) => {
  const { getRelative } = useSvgContext();
  const endpointSize = getRelative(1);
  const strokeWidth = getRelative(0.6);
  return (
    <motion.circle
      className="fill-gray4 stroke-current"
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
    <g strokeWidth={getRelative(0.5)} className="stroke-gray10">
      {commands.map((command) => {
        switch (command.code) {
          case "A": {
            const { cx, cy } = command as AbsoluteArcCommand;
            return (
              <g>
                <ellipse
                  key={command.id}
                  cx={cx}
                  cy={cy}
                  rx={command.rx}
                  ry={command.ry}
                  fill="none"
                />
                <line
                  x1={cx}
                  x2={cx + command.rx}
                  y1={cy}
                  y2={cy}
                  strokeDasharray={getRelative(1)}
                />
                <line
                  x1={cx}
                  x2={cx}
                  y1={cy}
                  y2={cy + command.ry}
                  strokeDasharray={getRelative(1)}
                />
                <circle
                  cx={cx}
                  cy={cy}
                  r={getRelative(0.8)}
                  className="fill-gray10"
                />
              </g>
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
      {commands.map((command) => {
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
            if (!command.source.relative) return null;
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

const Endpoints = () => {
  const { getRelative } = useSvgContext();
  const { commands } = usePathContext();
  return (
    <g>
      {commands.map((command, i) => {
        return (
          <g key={command.code + i}>
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
      return null;
    }
    case "L": {
      if (!command.source.relative) return null;
      return (
        <circle
          cx={command.x0}
          cy={command.y}
          r={getRelative(0.8)}
          className="fill-gray10"
        />
      );
    }
    case "Q": {
      return (
        <circle
          cx={command.x1}
          cy={command.y1}
          r={getRelative(0.8)}
          className="fill-gray10"
        />
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
