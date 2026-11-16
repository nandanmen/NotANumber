"use client";

import { motion } from "framer-motion";

import { cn } from "~/lib/cn";

type CharacterListProps = {
  state: {
    input: string;
    current: number;
  };
};

export function CharacterList({ state }: CharacterListProps) {
  return (
    <div className="relative h-10 w-full overflow-x-hidden">
      <motion.div
        className="absolute left-1/2 flex font-mono"
        animate={{ x: -(state.current * 10) }}
        transition={{ type: "linear" }}
      >
        {[...state.input].map((char, index) => {
          const isActive = index === state.current;
          return (
            <p
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed string positions; index is stable per character slot
              key={index}
              className={cn(
                "relative text-gray9",
                char === " " && "w-[12.3px]",
                isActive && "bg-gray12 text-gray1",
              )}
            >
              {char === "\n" ? "\\n" : char}
            </p>
          );
        })}
      </motion.div>
    </div>
  );
}
