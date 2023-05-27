import React from "react";
import { clsx } from "clsx";
import { motion } from "framer-motion";
import { Command, parsePath, Path } from "../lib/path";
import { useStateContext } from "../components/state-context";

const mapCodeToHint = {
  M: "move",
  m: "relative move",
  L: "line",
  l: "relative line",
  V: "vertical line",
  v: "relative vertical line",
  q: "relative quadratic curve",
  Q: "quadratic curve",
  h: "relative horizontal line",
  H: "horizontal line",
  z: "close path",
  Z: "close path",
  C: "cubic curve",
  c: "relative cubic curve",
  s: "relative shorthand cubic curve",
  S: "shorthand cubic curve",
  t: "relative shorthand quadratic curve",
  T: "shorthand quadratic curve",
  a: "relative arc",
  A: "arc",
};

export const CommandListFromSource = ({ source }: { source: string }) => {
  const {
    data: { path, active },
    set,
  } = useStateContext<{
    path: Path;
    index: number;
    expanded: boolean;
    active?: string[];
  }>(source);
  return <CommandList active={active} path={path} onChange={set} />;
};

export const CommandList = ({
  path: initialPath,
  onChange = () => {},
  collapseAfter,
  active,
  indices = [],
}: {
  path: Path | string;
  active?: string[];
  onChange?: (state: { index: number; expanded: boolean }) => void;
  collapseAfter?: number;
  indices?: number[];
}) => {
  const path = React.useMemo(() => {
    if (typeof initialPath === "string") {
      return parsePath(initialPath);
    }
    return initialPath;
  }, [initialPath]);
  const [index, setIndex] = React.useState(null);
  const [expanded, setExpanded] = React.useState(false);
  const _commands = expanded
    ? path.commands
    : path.commands.slice(0, collapseAfter);

  React.useEffect(() => {
    onChange({ index, expanded });
  }, [onChange, index, expanded]);

  return (
    <ol className="border py-3 border-gray8 bg-gray3 rounded-md font-mono relative overflow-hidden">
      {_commands.map((command, i) => {
        return (
          <motion.li
            key={command.id}
            className={clsx(
              "py-1 flex justify-between items-center group hover:bg-gray5",
              indices.includes(i)
                ? "bg-gray6 border-gray8 border-l-4 px-3"
                : "px-4"
            )}
            onHoverStart={() => setIndex(i)}
            onHoverEnd={() => setIndex(null)}
          >
            <CommandText command={command} active={active} />
            <span className="text-sm text-gray11 hidden group-hover:inline">
              {mapCodeToHint[command.code]}
            </span>
          </motion.li>
        );
      })}
      {collapseAfter && !expanded && (
        <>
          <li className="py-1 px-4 opacity-50">
            {path.at(collapseAfter).toPathString()}
          </li>
          <li className="py-1 px-4 absolute opacity-20">
            {path.at(collapseAfter + 1).toPathString()}
          </li>
        </>
      )}
      {collapseAfter && (
        <motion.button
          onClick={() => setExpanded(!expanded)}
          className="absolute bottom-0 right-0 p-2 block"
          animate={{
            rotate: expanded ? 180 : 0,
            y: index === path.commands.length - 1 ? 16 : 0,
          }}
          title={expanded ? "Hide commands" : "Show all commands"}
        >
          <ChevronDown />
        </motion.button>
      )}
    </ol>
  );
};

const CommandText = ({
  command,
  active = [],
}: {
  command: Command;
  active?: string[];
}) => {
  const isActive = (id: string, prop: string) => {
    return active?.includes(`${id}.${prop}`);
  };
  switch (command.code) {
    case "M":
    case "m":
    case "L":
    case "l":
    case "T":
    case "t":
      return (
        <span className="flex gap-[1ch]">
          <span>{command.code}</span>
          <Highlight value={command.x} active={isActive(command.id, "x")} />
          <Highlight value={command.y} active={isActive(command.id, "y")} />
        </span>
      );
    case "H":
    case "h":
      return (
        <span className="flex gap-[1ch]">
          <span>{command.code}</span>
          <Highlight value={command.x} active={isActive(command.id, "x")} />
        </span>
      );
    case "V":
    case "v":
      return (
        <span className="flex gap-[1ch]">
          <span>{command.code}</span>
          <Highlight value={command.y} active={isActive(command.id, "y")} />
        </span>
      );
    case "Q":
    case "q":
      return (
        <span className="flex gap-[1ch]">
          <span>{command.code}</span>
          <Highlight value={command.x1} active={isActive(command.id, "x1")} />
          <Highlight value={command.y1} active={isActive(command.id, "y1")} />
          <Highlight value={command.x} active={isActive(command.id, "x")} />
          <Highlight value={command.y} active={isActive(command.id, "y")} />
        </span>
      );
    case "S":
    case "s":
      return (
        <span className="flex gap-[1ch]">
          <span>{command.code}</span>
          <Highlight value={command.x2} active={isActive(command.id, "x2")} />
          <Highlight value={command.y2} active={isActive(command.id, "y2")} />
          <Highlight value={command.x} active={isActive(command.id, "x")} />
          <Highlight value={command.y} active={isActive(command.id, "y")} />
        </span>
      );
    case "C":
    case "c":
      return (
        <span className="flex gap-[1ch]">
          <span>{command.code}</span>
          <Highlight value={command.x1} active={isActive(command.id, "x1")} />
          <Highlight value={command.y1} active={isActive(command.id, "y1")} />
          <Highlight value={command.x2} active={isActive(command.id, "x2")} />
          <Highlight value={command.y2} active={isActive(command.id, "y2")} />
          <Highlight value={command.x} active={isActive(command.id, "x")} />
          <Highlight value={command.y} active={isActive(command.id, "y")} />
        </span>
      );
    case "A":
    case "a":
      return (
        <span className="flex gap-[1ch]">
          <span>{command.code}</span>
          <Highlight value={command.rx} active={isActive(command.id, "rx")} />
          <Highlight value={command.ry} active={isActive(command.id, "ry")} />
          <Highlight
            value={command.xAxisRotation}
            active={isActive(command.id, "xAxisRotation")}
          />
          <Highlight
            value={command.largeArc ? 1 : 0}
            active={isActive(command.id, "largeArc")}
          />
          <Highlight
            value={command.sweep ? 1 : 0}
            active={isActive(command.id, "sweep")}
          />
          <Highlight value={command.x} active={isActive(command.id, "x")} />
          <Highlight value={command.y} active={isActive(command.id, "y")} />
        </span>
      );
    default:
      return null;
  }
};

const ChevronDown = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8.75 7.75L12 11.25L15.25 7.75" />
        <path d="M8.75 12.75L12 16.25L15.25 12.75" />
      </g>
    </svg>
  );
};

const Highlight = ({
  value,
  active = false,
}: {
  value: number;
  active: boolean;
}) => {
  return (
    <span
      className={clsx(
        "transition-all",
        active && "bg-gray12 text-gray1 -mx-1 px-1 rounded-[4px]"
      )}
    >
      {value.toFixed(1)}
    </span>
  );
};
