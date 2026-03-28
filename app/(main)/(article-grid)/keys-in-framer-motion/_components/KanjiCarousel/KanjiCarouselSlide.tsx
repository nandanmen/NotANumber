"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArticleBleed } from "../article-bleed";
import {
  Content,
  Controls,
  ToggleButton,
  Visualizer,
} from "~/components/Visualizer";
import { cn } from "~/lib/cn";
import { FaArrowRight } from "react-icons/fa";

const KANJI = ["中", "学", "校"];

export const KanjiCarouselSlide = () => {
  const [hasOverflow, toggle] = React.useReducer((state) => !state, true);
  const [currentIndex, next] = React.useReducer((index) => {
    return Math.min(index + 1, KANJI.length - 1);
  }, 0);

  return (
    <ArticleBleed>
      <Visualizer>
        <Content className="flex items-center justify-center py-16">
          <div className="flex items-center">
            <div
              className={cn(
                "relative w-[200px] border border-gray8 bg-gray4 py-4 text-center text-[8rem] font-bold rounded-md",
                !hasOverflow && "overflow-hidden",
              )}
            >
              <motion.div
                animate={{ x: -400 + currentIndex * 200 }}
                transition={{ type: "spring", damping: 20 }}
                className="flex"
              >
                {KANJI.map((char) => (
                  <p key={char} className="w-[200px] shrink-0">
                    {char}
                  </p>
                ))}
              </motion.div>
            </div>
            <motion.button
              type="button"
              onClick={next}
              className={cn(
                "flex aspect-square -translate-x-[14px] items-center justify-center rounded-full border border-gray8 bg-gray2 p-3 shadow-md",
                "hover:outline hover:outline-[3px] hover:outline-gray8",
                "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-gray8",
              )}
            >
              <FaArrowRight size="1.5rem" />
            </motion.button>
          </div>
        </Content>
        <Controls className="justify-center">
          <ToggleButton onClick={toggle}>
            {hasOverflow ? "Hide" : "Show"} Overflow
          </ToggleButton>
        </Controls>
      </Visualizer>
    </ArticleBleed>
  );
};
