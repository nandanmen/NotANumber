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
import { Svg, useSvgContext } from "../components/svg";

const questions = [
  {
    path: "M2.5 2.49982L9 20.4998L12.5 12.4998L20.5 8.99982L2.5 2.49982Z",
    name: "cursor",
    x: 2,
    y: 2,
  },
  {
    path: "M17 5L21 9L17 13M21 9H3V18H12",
    name: "arrow",
    x: 1,
    y: 0,
  },
  {
    path: "M 10.5 3.1 A 9 9 0 1 0 20.9 13.4 A 8 8 0 0 1 10.5 3.1 Z",
    name: "moon",
    x: 0.5,
    y: 0.5,
  },
  {
    path: "M 2 13 h 20 C 21 1 3 1 2 13 Z M 12 2 V 4 M 12 14 v 4 a 2 2 0 0 1 -2 2 a 2 2 0 0 1 -2 -2",
    name: "umbrella",
    x: 1,
    y: 1,
  },
  {
    path: "M14 16.0341C13.3267 17.8 11.7891 19.0341 10 19.0341C8.21087 19.0341 6.67327 17.8 6 16.0341M18 16.0341L16.793 6.98149C16.339 3.57682 13.4348 1.03412 10 1.03412C6.56521 1.03412 3.66097 3.57682 3.20702 6.98148L2 16.0341H18Z",
    name: "bell",
    x: 2.5,
    y: 2.5,
  },
  {
    path: "M11.9695 7.40912V11.4091L14.4695 13.9091M1.96948 4.65912L4.96948 1.65912M21.9695 4.65912L18.9695 1.65912 M21 11.4 a 9 9 0 0 0 -18 0 a 9 9 0 0 0 18 0 z",
    name: "clock",
    x: 1,
    y: 1,
  },
  {
    path: "M17.9695 4.7052L9.96948 1.9552L1.96948 4.7052V10.8675C1.96948 15.84 5.96948 17.9552 9.96948 20.1131C13.9695 17.9552 17.9695 15.84 17.9695 10.8675V4.7052Z",
    name: "shield",
    x: 2.5,
    y: 1.5,
  },
  {
    path: "M 2 8 C 7 -1.2 17 -1.2 22 8 C 17 17.2 7 17.2 2 8 Z M 9 8 a 3 3 0 0 0 6 0 a 3 3 0 0 0 -6 0 z",
    name: "eye",
    x: 1,
    y: 4.5,
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
      <MDX content={content} numSections={length} components={{ Editor }}>
        <VisualWrapper
          components={[
            { children: <PathAnimation /> },
            { children: <IconList />, svg: false },
            ...questions.map(({ name, x, y }) => {
              return {
                children: (
                  <g transform={`translate(${x}, ${y})`}>
                    <PracticeQuestion questionKey={name} />
                  </g>
                ),
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
    <>
      <Svg />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 grid grid-cols-[repeat(4,200px)] gap-8">
        {questions.map(({ path, name }) => {
          return (
            <div key={name}>
              <svg width="200" viewBox="0 0 25 25">
                <path
                  d={path}
                  fill="none"
                  strokeWidth="1"
                  stroke="currentColor"
                />
              </svg>
            </div>
          );
        })}
      </div>
    </>
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
