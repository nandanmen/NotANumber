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

type CommandKey = `${number}.${string}`;

export const CommandListFromSource = ({ source }: { source: string }) => {
  const {
    data: { path, active, blocklist },
    set,
  } = useStateContext<{
    path: Path;
    index: number;
    expanded: boolean;
    active?: CommandKey[];
    blocklist?: CommandKey[];
  }>(source);
  return (
    <CommandList
      active={active}
      blocklist={blocklist}
      path={path}
      onChange={set}
    />
  );
};

export const CommandList = ({
  path: initialPath,
  onChange = () => {},
  collapseAfter,
  active,
  highlight = [],
  blocklist = [],
}: {
  path: Path | string;
  active?: CommandKey[];
  onChange?: (state: { index: number; expanded: boolean }) => void;
  collapseAfter?: number;
  highlight?: number[];
  blocklist?: CommandKey[];
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
              highlight.includes(i)
                ? "bg-gray6 border-gray8 border-l-4 px-3"
                : "px-4"
            )}
            onHoverStart={() => setIndex(i)}
            onHoverEnd={() => setIndex(null)}
          >
            <span className="flex gap-[1ch]">
              <span>{command.code}</span>
              <CommandText
                index={i}
                command={command}
                active={active}
                blocked={blocklist}
              />
            </span>
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

export const CommandText = ({
  command,
  index,
  blocked,
  active,
}: {
  command: Command;
  index: number;
  blocked?: CommandKey[];
  active?: CommandKey[];
}) => {
  const getVariant = (prop: string): "blocked" | "active" | undefined => {
    const key = `${index}.${prop}` as CommandKey;
    if (blocked?.includes(key)) return "blocked";
    if (active?.includes(key)) return "active";
  };
  switch (command.code) {
    case "M":
    case "m":
    case "L":
    case "l":
    case "T":
    case "t":
      return (
        <>
          <Highlight value={command.x} variant={getVariant("x")} />
          <Highlight value={command.y} variant={getVariant("y")} />
        </>
      );
    case "H":
    case "h":
      return <Highlight value={command.x} variant={getVariant("x")} />;
    case "V":
    case "v":
      return <Highlight value={command.y} variant={getVariant("y")} />;
    case "Q":
    case "q":
      return (
        <>
          <Highlight value={command.x1} variant={getVariant("x1")} />
          <Highlight value={command.y1} variant={getVariant("y1")} />
          <Highlight value={command.x} variant={getVariant("x")} />
          <Highlight value={command.y} variant={getVariant("y")} />
        </>
      );
    case "S":
    case "s":
      return (
        <>
          <Highlight value={command.x2} variant={getVariant("x2")} />
          <Highlight value={command.y2} variant={getVariant("y2")} />
          <Highlight value={command.x} variant={getVariant("x")} />
          <Highlight value={command.y} variant={getVariant("y")} />
        </>
      );
    case "C":
    case "c":
      return (
        <>
          <Highlight value={command.x1} variant={getVariant("x1")} />
          <Highlight value={command.y1} variant={getVariant("y1")} />
          <Highlight value={command.x2} variant={getVariant("x2")} />
          <Highlight value={command.y2} variant={getVariant("y2")} />
          <Highlight value={command.x} variant={getVariant("x")} />
          <Highlight value={command.y} variant={getVariant("y")} />
        </>
      );
    case "A":
    case "a":
      return (
        <>
          <Highlight value={command.rx} variant={getVariant("rx")} />
          <Highlight value={command.ry} variant={getVariant("ry")} />
          <Highlight
            value={command.xAxisRotation}
            variant={getVariant("xAxisRotation")}
          />
          <Highlight
            value={command.largeArc ? 1 : 0}
            variant={getVariant("largeArc")}
          />
          <Highlight
            value={command.sweep ? 1 : 0}
            variant={getVariant("sweep")}
          />
          <Highlight value={command.x} variant={getVariant("x")} />
          <Highlight value={command.y} variant={getVariant("y")} />
        </>
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
  variant,
}: {
  value: number;
  variant?: "blocked" | "active";
}) => {
  return (
    <span
      className={clsx(
        "transition-all",
        variant === "active" && "bg-gray12 text-gray1 -mx-1 px-1 rounded-[4px]",
        variant === "blocked" && "text-gray9"
      )}
    >
      {value.toFixed(1)}
    </span>
  );
};