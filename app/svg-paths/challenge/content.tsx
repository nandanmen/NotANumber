"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "../components/button";
import { CommandListFromSource } from "../components/command-list";
import { MDX } from "../components/mdx";
import { PathEditor } from "../components/path-editor";
import {
  getInitialPracticeQuestionState,
  PracticeQuestion,
  PracticeQuestionState,
} from "../components/path-practice";
import { StateProvider, useStateContext } from "../components/state-context";
import { VisualWrapper } from "../components/visual-wrapper";
import { parsePath } from "../lib/path";
import { Path } from "../components/svg/path";
import { Circle } from "../components/svg/circle";
import { useSvgContext } from "../components/svg";

const questions = [
  {
    path: "M 4.5 4.5 l 18 6.5 l -8 3.5 l -3.5 8 z",
    name: "cursor",
  },
  {
    path: "M 18 5 l 4 4 l -4 4 m 4 -4 h -18 v 9 h 9",
    name: "arrow",
  },
  {
    path: "M 11 3.5 a 9 9 0 1 0 10.5 10.5 a 8 8 0 0 1 -10.5 -10.5 z",
    name: "moon",
  },
  {
    path: "M 3 14 h 20 c -1 -12 -19 -12 -20 0 z m 10 -11 v 2 m 0 10 v 4 a 2 2 0 0 1 -2 2 a 2 2 0 0 1 -2 -2",
    name: "umbrella",
  },
  {
    path: "M 4.5 18.5 l 1.5 -10 c 1 -7 12 -7 13 0 l 1.5 10 z m 12 0 c -2 4 -6 4 -8 0",
    name: "bell",
  },
  {
    path: "M 13 8.5 v 4 l 2.5 2.5 m -12.5 -9.5 l 3 -3 m 14 0 l 3 3 m -1 7 a 9 9 0 0 0 -18 0 a 9 9 0 0 0 18 0 z",
    name: "clock",
  },
  {
    path: "M 4.5 6 v 7 c 0 5 4 7 8 8.5 c 4 -1.5 8 -3.5 8 -8.5 v -7 l -8 -2.5 z",
    name: "shield",
  },
  {
    path: "M 3 12.5 c 5 -9.2 15 -9.2 20 0 c -5 9.2 -15 9.2 -20 0 z m 7 0 a 3 3 0 0 0 6 0 a 3 3 0 0 0 -6 0 z",
    name: "eye",
  },
];

export function Content({ content, length }) {
  return (
    <StateProvider
      initial={{
        ...questions.reduce((acc, { path, name }) => {
          return {
            ...acc,
            ...getInitialPracticeQuestionState(parsePath(path), name),
          };
        }, {}),
      }}
    >
      <MDX
        content={content}
        numSections={length}
        components={{ Editor, IconList }}
      >
        <VisualWrapper
          components={[
            { children: <PathAnimation /> },
            { children: <IconList />, svg: 20 },
            ...questions.map(({ name }) => {
              return {
                children: <PracticeQuestion questionKey={name} />,
              };
            }),
          ]}
        />
      </MDX>
    </StateProvider>
  );
}

function IconList() {
  return (
    <motion.g
      transform="translate(0, 5)"
      animate="active"
      initial="hidden"
      transition={{ staggerChildren: 0.1 }}
    >
      {questions.map(({ path, name }, index) => {
        return (
          <svg
            key={name}
            x={(index * 5) % 20}
            y={index > 3 ? 5 : 0}
            viewBox="0 0 25 25"
            width="5"
            height="5"
          >
            <motion.path
              variants={{
                hidden: { opacity: 0, scale: 0.96 },
                active: { opacity: 1, scale: 1 },
              }}
              transition={{
                duration: 0.3,
              }}
              d={path}
              fill="none"
              strokeWidth="1"
              stroke="currentColor"
            />
          </svg>
        );
      })}
    </motion.g>
  );
}

function PathAnimation() {
  const { getRelative } = useSvgContext();
  return (
    <g>
      <rect
        x="5"
        y="5"
        width="15"
        height="15"
        strokeWidth={getRelative(1)}
        className="fill-none stroke-gray8"
      />
      <Path
        d="M 5 5 q 7.5 0 15 0 q 0 7.5 0 15 q -7.5 0 -15 0 q 0 -7.5 0 -15 z"
        animate={{
          d: "M 12.5 5 q 7.5 0 7.5 7.5 q 0 7.5 -7.5 7.5 q -7.5 0 -7.5 -7.5 q 0 -7.5 7.5 -7.5 z",
        }}
        transition={{ type: "spring", duration: 2, bounce: 0.3 }}
      />
      <motion.g
        animate={{ x: 7.5, y: 0 }}
        transition={{ type: "spring", duration: 2, bounce: 0.3 }}
      >
        <Circle cx={5} cy={5} variant="point" />
        <Circle cx={12.5} cy={5} variant="point" />
      </motion.g>
      <motion.g
        animate={{ x: 0, y: 7.5 }}
        transition={{ type: "spring", duration: 2, bounce: 0.3 }}
      >
        <Circle cx={20} cy={5} variant="point" />
        <Circle cx={20} cy={12.5} variant="point" />
      </motion.g>
      <motion.g
        animate={{ x: -7.5, y: 0 }}
        transition={{ type: "spring", duration: 2, bounce: 0.3 }}
      >
        <Circle cx={20} cy={20} variant="point" />
        <Circle cx={12.5} cy={20} variant="point" />
      </motion.g>
      <motion.g
        animate={{ x: 0, y: -7.5 }}
        transition={{ type: "spring", duration: 2, bounce: 0.3 }}
      >
        <Circle cx={5} cy={20} variant="point" />
        <Circle cx={5} cy={12.5} variant="point" />
      </motion.g>
    </g>
  );
}

function Editor({ questionKey }: { questionKey: string }) {
  const {
    data: { showAnswer },
    set,
  } = useStateContext<Record<string, PracticeQuestionState>>()(questionKey);
  const [showReference, setShowReference] = React.useState(true);

  return (
    <div className="space-y-4">
      <PathEditor id={questionKey} placeholder="M 5 10" />
      <div className="flex justify-between relative">
        <div className="absolute h-px w-full bg-gray8 top-1/2" />
        <div className="relative pr-2 bg-gray4">
          <Button onClick={() => set({ showAnswer: !showAnswer })}>
            {showAnswer ? "Hide Answer" : "Reveal Answer"}
          </Button>
        </div>
        <button
          className="pl-2 pr-1 hover:bg-gray6 text-gray11 font-bold rounded-md flex gap-1 items-center group relative bg-gray4"
          onClick={() => setShowReference(!showReference)}
          data-open={showReference ? "true" : undefined}
        >
          <span>Reference</span>
          <span className="block transition-transform rotate-180 group-data-[open]:rotate-0">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              stroke="currentColor"
            >
              <path d="M8.75 11.25L12 7.75L15.25 11.25" />
              <path d="M8.75 16.25L12 12.75L15.25 16.25" />
            </svg>
          </span>
        </button>
      </div>
      {showAnswer && <CommandListFromSource source={questionKey} />}
      {showReference && <PathReference />}
    </div>
  );
}

const commands = [
  {
    sample: "M x y",
    description: "Moves the cursor to the position (x, y).",
    children: (
      <g className="text-gray10">
        <line
          x1="0"
          y1="0"
          x2="7.5"
          y2="7.5"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="1.5"
        />
        <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" />
      </g>
    ),
  },
  {
    sample: "L x y",
    description: "Draws a line from the current position to (x, y).",
    children: (
      <g>
        <line
          x1="0"
          y1="0"
          x2="7.5"
          y2="7.5"
          stroke="currentColor"
          strokeWidth="1"
        />
        <circle
          cx="7.5"
          cy="7.5"
          r="1.5"
          className="fill-gray4"
          stroke="currentColor"
        />
      </g>
    ),
  },
  {
    sample: "H x",
    description: "Draws a horizontal line from the current position to x.",
    children: (
      <g>
        <line
          x1="0"
          y1="7.5"
          x2="7.5"
          y2="7.5"
          stroke="currentColor"
          strokeWidth="1"
        />
        <circle
          cx="7.5"
          cy="7.5"
          r="1.5"
          className="fill-gray4"
          stroke="currentColor"
        />
      </g>
    ),
  },
  {
    sample: "V y",
    description: "Draws a vertical line from the current position to y.",
    children: (
      <g>
        <line
          x1="7.5"
          y1="0"
          x2="7.5"
          y2="7.5"
          stroke="currentColor"
          strokeWidth="1"
        />
        <circle
          cx="7.5"
          cy="7.5"
          r="1.5"
          className="fill-gray4"
          stroke="currentColor"
        />
      </g>
    ),
  },
  {
    sample: "Z",
    description:
      "Draws a line from the current position to the start position.",
    children: (
      <g>
        <line
          x1="0"
          y1="0"
          x2="7.5"
          y2="7.5"
          stroke="currentColor"
          strokeWidth="1"
        />
        <circle
          cx="0"
          cy="0"
          r="1.5"
          className="fill-gray4"
          stroke="currentColor"
        />
        <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" />
      </g>
    ),
  },
];

const curves = [
  {
    sample: "C x1 y1, x2 y2, x y",
    description:
      "Draws a cubic bezier curve from the current position to (x, y), using (x1, y1) and (x2, y2) as control points.",
    children: (
      <g>
        <path
          d="M 0 7.5 C 5 -5 10 20 15 7.5"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
        />
        <circle
          cx="15"
          cy="7.5"
          r="1.5"
          className="fill-gray4"
          stroke="currentColor"
        />
      </g>
    ),
  },
  {
    sample: "S x2 y2, x y",
    description:
      "Draws a cubic bezier curve from the current position to (x, y), using the previous control point's reflection and (x2, y2) as control points.",
    children: (
      <g>
        <g className="text-gray10">
          <line stroke="currentColor" x1="10" y1="15" x2="15" y2="7.5" />
          <circle cx="10" cy="15" r="1.5" fill="currentColor" />
        </g>
        <path
          d="M 0 7.5 C 5 -5 10 20 15 7.5"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
        />
        <circle
          cx="15"
          cy="7.5"
          r="1.5"
          className="fill-gray4"
          stroke="currentColor"
        />
      </g>
    ),
  },
  {
    sample: "Q x1 y1, x y",
    description:
      "Draws a quadratic bezier curve from the current position to (x, y), using (x1, y1) as a control point.",
    children: (
      <g>
        <path
          d="M 0 10 Q 7.5 0 15 10"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
        />
        <circle
          cx="15"
          cy="10"
          r="1.5"
          className="fill-gray4"
          stroke="currentColor"
        />
      </g>
    ),
  },
  {
    sample: "T x y",
    description:
      "Draws a quadratic bezier curve from the current position to (x, y), using the previous control point's reflection as a control point.",
    children: (
      <g>
        <g className="text-gray10">
          <line stroke="currentColor" x1="7.5" y1="5" x2="15" y2="5" />
          <circle cx="15" cy="5" r="1.5" fill="currentColor" />
        </g>
        <path
          d="M 0 10 Q 7.5 0 15 10"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
        />
        <circle
          cx="15"
          cy="10"
          r="1.5"
          className="fill-gray4"
          stroke="currentColor"
        />
      </g>
    ),
  },
  {
    sample: "A rx ry x-axis-rotation large-arc sweep x y",
    description: "Draws an elliptical arc from the current position to (x, y).",
    children: (
      <g>
        <g className="text-gray10">
          <line
            stroke="currentColor"
            x1="15"
            y1="0"
            x2="5"
            y2="10"
            strokeDasharray="1.5"
          />
          <circle cx="15" cy="0" r="1.5" fill="currentColor" />
        </g>
        <path
          d="M 0 0 A 15 15 0 0 0 15 15"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
        />
        <circle
          cx="15"
          cy="15"
          r="1.5"
          className="fill-gray4"
          stroke="currentColor"
        />
      </g>
    ),
  },
];

function PathReference() {
  return (
    <div className="space-y-6 divide-y divide-gray8 divide-dashed">
      <section>
        <h3 className="font-bold text-gray11 mb-4">Cursors & Lines</h3>
        <ul className="grid grid-cols-2 gap-4">
          {commands.map((command) => {
            return <CommandReference key={command.sample} command={command} />;
          })}
        </ul>
      </section>
      <section className="pt-4">
        <h3 className="font-bold text-gray11 mb-4">Curves</h3>
        <ul className="space-y-4">
          {curves.map((command) => {
            return <CommandReference key={command.sample} command={command} />;
          })}
        </ul>
      </section>
    </div>
  );
}

function CommandReference({
  command,
}: {
  command: {
    sample: string;
    description: string;
    children?: React.ReactNode;
  };
}) {
  const id = React.useId();
  return (
    <li className="flex gap-4">
      <figure>
        <svg width="56" viewBox="-2 -2 19 19">
          <defs>
            <pattern id={id} patternUnits="userSpaceOnUse" width="5" height="5">
              <line
                x1="5"
                y1="0"
                x2="5"
                y2="5"
                className="stroke-gray7"
                strokeWidth={1}
              />
              <line
                x1="0"
                y1="5"
                x2="5"
                y2="5"
                className="stroke-gray7"
                strokeWidth={1}
              />
            </pattern>
          </defs>
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="15"
            className="stroke-gray7"
            strokeWidth={0.55}
          />
          <line
            x1="0"
            y1="0"
            x2="15"
            y2="0"
            className="stroke-gray7"
            strokeWidth={0.55}
          />
          <rect width="15" height="15" fill={`url(#${id})`} />
          {command.children}
        </svg>
      </figure>
      <div className="space-y-1">
        <p>
          <code>{command.sample}</code>
        </p>
        <p className="text-sm">{command.description}</p>
      </div>
    </li>
  );
}
