"use client";

import React from "react";
import {
  parseSVG,
  makeAbsolute,
  type CommandMadeAbsolute,
  type Command,
} from "svg-path-parser";
import { produce } from "immer";
import { clsx } from "clsx";
import { useSvgContext } from "./svg";
import { getArcCenter } from "./utils";

const getColor = (code: CommandMadeAbsolute["code"]) => {
  if (code === "A") return "text-blue10";
  if (["L", "H", "V"].includes(code)) return "text-green10";
  if (["C", "S", "Q", "T"].includes(code)) return "text-cyan10";
  return "text-gray10";
};

const toPath = (command: CommandMadeAbsolute) => {
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

const mapCodeToType = (code: CommandMadeAbsolute["code"]): CommandType => {
  if (code === "A") return "arc";
  if (["L", "H", "V"].includes(code)) return "line";
  if (["C", "S", "Q", "T"].includes(code)) return "curve";
  return "cursor";
};

const PathContext = React.createContext<{
  path: string;
  commands: Command[];
  absoluteCommands: CommandMadeAbsolute[];
  hasIndex: boolean;
  index?: number;
  type?: CommandType;
}>(null);

export function usePathContext() {
  return React.useContext(PathContext);
}

export function PathVisualizer({
  path,
  index,
  type,
}: {
  path: string;
  index?: number;
  type?: CommandType;
}) {
  const commands = parseSVG(path);
  const absoluteCommands = produce(commands, (draft) =>
    makeAbsolute(draft)
  ) as CommandMadeAbsolute[];
  const hasIndex = typeof index === "number";

  return (
    <g>
      <PathContext.Provider
        value={{
          path,
          commands,
          absoluteCommands,
          hasIndex,
          index,
          type,
        }}
      >
        <g className={(type || hasIndex) && "text-gray8"}>
          <Arcs />
          <Lines />
          <Sections />
          <Endpoints />
          <CursorPoints />
        </g>
      </PathContext.Provider>
    </g>
  );
}

const Sections = () => {
  const { getRelative } = useSvgContext();
  const { absoluteCommands, type } = usePathContext();
  return (
    <g>
      {absoluteCommands.map((command, index) => {
        const active = !type || type === mapCodeToType(command.code);
        return (
          <g key={command.code + index}>
            <path
              d={toPath(command)}
              className={clsx(
                "fill-none",
                active ? "stroke-gray12" : "stroke-current"
              )}
              strokeWidth={getRelative(1)}
            />
          </g>
        );
      })}
    </g>
  );
};

const Arcs = () => {
  const { getRelative } = useSvgContext();
  const { absoluteCommands } = usePathContext();
  return (
    <g strokeWidth={getRelative(0.5)}>
      {absoluteCommands.map((command, index) => {
        switch (command.code) {
          case "A": {
            const { cx, cy } = getArcCenter(command);
            return (
              <ellipse
                key={command.code + index}
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
  const { absoluteCommands, type } = usePathContext();
  return (
    <g strokeWidth={getRelative(0.5)} className="stroke-gray10">
      {absoluteCommands.map((command, index) => {
        const active = !type || type === mapCodeToType(command.code);
        if (!active) return null;
        switch (command.code) {
          case "M": {
            return (
              <line
                key={command.code + index}
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
              <g key={command.code + index}>
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
              <g key={command.code + index}>
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

const Text = ({ children, ...props }) => {
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

const CursorPoints = () => {
  const { getRelative } = useSvgContext();
  const { absoluteCommands, type } = usePathContext();
  return (
    <g>
      {absoluteCommands.map((command, i) => {
        if (command.code === "Z") return null;
        const active = !type || type === mapCodeToType(command.code);
        return (
          <circle
            key={command.code + i}
            cx={command.x}
            cy={command.y}
            r={getRelative(1)}
            strokeWidth={getRelative(0.6)}
            className={clsx(
              "fill-gray4",
              active ? "stroke-gray12" : "stroke-current"
            )}
          />
        );
      })}
    </g>
  );
};

const Endpoints = () => {
  const { getRelative } = useSvgContext();
  const { absoluteCommands, type } = usePathContext();
  return (
    <g>
      {absoluteCommands.map((command, i) => {
        const active = !type || type === mapCodeToType(command.code);
        if (!active) return null;
        switch (command.code) {
          case "M": {
            if (!command.x0 && !command.y0) {
              return (
                <circle
                  key={command.code + i}
                  cx="0"
                  cy="0"
                  r={getRelative(1)}
                  className="fill-gray10"
                />
              );
            }
          }
          case "L": {
            return (
              <g key={command.code + i}>
                <circle
                  cx={command.x0}
                  cy={command.y}
                  r={getRelative(0.8)}
                  className="fill-gray10"
                />
              </g>
            );
          }
          case "C": {
            return (
              <g key={command.code + i}>
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
              </g>
            );
          }
          default:
            return null;
        }
      })}
    </g>
  );
};
