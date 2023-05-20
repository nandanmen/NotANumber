import React from "react";
import { clsx } from "clsx";
import { motion } from "framer-motion";
import { useStateContext } from "../components/state-context";
import type { SyntaxState } from "./types";

export const SyntaxExample = () => {
  const {
    data: { x1, y1, x, y, x2, y2, active },
  } = useStateContext<SyntaxState>("syntax");
  return (
    <p className="border border-gray8 bg-gray3 px-4 py-3 rounded-md font-mono relative overflow-hidden flex gap-[1ch]">
      <span className="text-gray10">M 5 13</span>
      <span>C</span>
      <Highlight value={x1} active={active === "x1"} />
      <Highlight value={y1} active={active === "x1"} />
      <Highlight value={x2} active={active === "x2"} />
      <Highlight value={y2} active={active === "x2"} />
      <Highlight value={x} active={active === "x"} />
      <Highlight value={y} active={active === "x"} />
    </p>
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
        active && "bg-gray7 -mx-1 px-1 rounded-[4px]"
      )}
    >
      {value.toFixed(1)}
    </span>
  );
};

export const CommandHighlight = ({
  commands,
  indices,
  collapseAfter,
}: {
  commands: string[];
  indices: number[];
  collapseAfter?: number;
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const _commands = expanded ? commands : commands.slice(0, collapseAfter);
  return (
    <ol className="border border-gray8 bg-gray3 px-4 py-3 rounded-md font-mono relative overflow-hidden">
      {_commands.map((command, i) => {
        return (
          <li
            key={command}
            className={clsx(
              indices.includes(i) &&
                "-mx-4 px-3 bg-gray6 border-l-4 border-gray8"
            )}
          >
            {command}
          </li>
        );
      })}
      {collapseAfter && !expanded && (
        <>
          <li className="opacity-50">{commands.at(collapseAfter)}</li>
          <li className="absolute opacity-20">
            {commands.at(collapseAfter + 1)}
          </li>
        </>
      )}
      {collapseAfter && (
        <motion.button
          onClick={() => setExpanded(!expanded)}
          className="absolute bottom-2 right-2"
          animate={{ rotate: expanded ? 180 : 0 }}
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
