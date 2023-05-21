import React, { ReactNode } from "react";
import { clsx } from "clsx";
import { motion } from "framer-motion";
import { useStateContext } from "app/svg-paths/components/state-context";

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

export type CommandText =
  | string
  | {
      code: string;
      template: ReactNode;
    };

const getNode = (command: CommandText) => {
  if (typeof command === "string") {
    return command;
  }
  return command.template;
};

export const CommandHighlight = ({
  id,
  commands,
  indices = [],
  collapseAfter,
  onIndexChange = () => {},
}: {
  id?: string;
  commands: CommandText[];
  indices?: number[];
  collapseAfter?: number;
  onIndexChange?: (index: number) => void;
}) => {
  const { set } = useStateContext<{ index: number; expanded: boolean }>(id);
  const [active, setActive] = React.useState(null);
  const [expanded, setExpanded] = React.useState(false);
  const _commands = expanded ? commands : commands.slice(0, collapseAfter);

  React.useEffect(() => {
    if (id) {
      set({ index: active, expanded });
    }
  }, [id, active, expanded, set]);

  React.useEffect(() => {
    onIndexChange(active);
  }, [onIndexChange, active]);

  return (
    <ol className="border py-3 border-gray8 bg-gray3 rounded-md font-mono relative overflow-hidden">
      {_commands.map((command, i) => {
        const isString = typeof command === "string";
        const key = isString ? command : command.code + i;
        return (
          <motion.li
            key={key}
            className={clsx(
              "py-1 flex justify-between items-center group hover:bg-gray5",
              indices.includes(i)
                ? "bg-gray6 border-gray8 border-l-4 px-3"
                : "px-4"
            )}
            onHoverStart={() => setActive(i)}
            onHoverEnd={() => setActive(null)}
          >
            <span>{getNode(command)}</span>
            <span className="text-sm text-gray11 hidden group-hover:inline">
              {mapCodeToHint[isString ? command.at(0) : command.code]}
            </span>
          </motion.li>
        );
      })}
      {collapseAfter && !expanded && (
        <>
          <li className="py-1 px-4 opacity-50">
            {getNode(commands.at(collapseAfter))}
          </li>
          <li className="py-1 px-4 absolute opacity-20">
            {getNode(commands.at(collapseAfter + 1))}
          </li>
        </>
      )}
      {collapseAfter && (
        <motion.button
          onClick={() => setExpanded(!expanded)}
          className="absolute bottom-0 right-0 p-2 block"
          animate={{
            rotate: expanded ? 180 : 0,
            y: active === commands.length - 1 ? 16 : 0,
          }}
          title={expanded ? "Hide commands" : "Show all commands"}
        >
          <ChevronDown />
        </motion.button>
      )}
    </ol>
  );
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
