"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArticleBleed } from "../article-bleed";
import { Content, Visualizer } from "~/components/Visualizer";
import { cn } from "~/lib/cn";

export const Button = ({ toggled, onClick = () => {} }) => {
  return (
    <motion.button
      type="button"
      layout
      onClick={onClick}
      className={cn(
        "rounded-md border border-gray8 bg-gray1 py-2 px-4",
        "hover:border-gray12",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gray8",
      )}
    >
      <motion.span
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ delay: 0.2 }}
        key={String(toggled)}
      >
        {toggled ? "Next" : "Show Answer"}
      </motion.span>
    </motion.button>
  );
};

export const NextButton = () => {
  const [toggled, toggle] = React.useReducer((state) => !state, false);
  return (
    <ArticleBleed>
      <Visualizer>
        <Content className="flex items-center justify-center p-10">
          <Button toggled={toggled} onClick={toggle} />
        </Content>
      </Visualizer>
    </ArticleBleed>
  );
};
