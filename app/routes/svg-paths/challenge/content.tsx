"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "../components/button";
import { CommandListFromSource } from "../components/command-list";
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
import { ContentWrapper } from "../components/content-wrapper";
import { IconList, questions } from "./editor";


export function Content({ children, length }) {
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
      <ContentWrapper
        content={children}
        numSections={length}
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
      </ContentWrapper>
    </StateProvider>
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
