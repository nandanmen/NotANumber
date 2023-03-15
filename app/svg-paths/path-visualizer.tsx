"use client";

import {
  parseSVG,
  makeAbsolute,
  type CommandMadeAbsolute,
} from "svg-path-parser";
import { produce } from "immer";
import { useSvgContext } from "./svg";

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

export function PathVisualizer({ command }: { command: string }) {
  const { getRelative } = useSvgContext();
  const path = parseSVG(command);
  const absolutePath = produce(path, (draft) =>
    makeAbsolute(draft)
  ) as CommandMadeAbsolute[];
  return (
    <g>
      {absolutePath.map((command, index) => {
        return (
          <path
            key={command.code + index}
            d={toPath(command)}
            className="stroke-gray12 fill-none"
            strokeWidth={getRelative(1)}
          />
        );
      })}
      {absolutePath.map((command, index) => {
        if (command.code === "M") return null;
        return (
          <circle
            key={command.code + index}
            cx={command.x0}
            cy={command.y0}
            r={getRelative(1)}
            strokeWidth={getRelative(0.6)}
            className="fill-gray4 stroke-gray12"
          />
        );
      })}
    </g>
  );
}
