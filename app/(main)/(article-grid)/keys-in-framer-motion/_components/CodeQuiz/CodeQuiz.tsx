"use client";

import { motion } from "framer-motion";
import React from "react";
import { cn } from "~/lib/cn";

const _caption = `When MyComponent mounts for the first time, its effect will run, printing "mounted" to the console. When we click on "Change Key", MyComponent will rerender, but since the effect has no dependencies, it won't run again!`;

function AnswerButton({
  children,
  onClick,
  showAnswer,
  isCorrect,
}: {
  children: React.ReactNode;
  onClick: () => void;
  showAnswer: boolean;
  isCorrect: boolean;
}) {
  return (
    <button
      type="button"
      className={cn(
        "bg-gray2 relative ring-1 ring-black/15 shadow-sm rounded-xl font-mono grid grid-cols-[min-content_auto] text-left gap-3 p-4 border-b-[3px] border-gray5 group",
        showAnswer &&
          !isCorrect &&
          "pointer-events-none bg-gray3 text-gray10 border-gray3 shadow-none",
        !showAnswer && "hover:bg-gradient-to-b from-gray2 to-gray3",
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          "absolute right-3.5 top-3.5 size-5 flex items-center justify-center rounded-full bg-gray5",
          showAnswer && (isCorrect ? "bg-green8" : "bg-white"),
        )}
      >
        {!showAnswer && (
          <div className="size-2.5 rounded-full bg-current opacity-0 group-hover:opacity-100" />
        )}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          width="24"
          aria-hidden="true"
          className="absolute"
        >
          {showAnswer &&
            (isCorrect ? (
              <path
                d="M8 12.875L10.625 15.5L15 9"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM9.70711 8.29289C9.31658 7.90237 8.68342 7.90237 8.29289 8.29289C7.90237 8.68342 7.90237 9.31658 8.29289 9.70711L10.5858 12L8.29289 14.2929C7.90237 14.6834 7.90237 15.3166 8.29289 15.7071C8.68342 16.0976 9.31658 16.0976 9.70711 15.7071L12 13.4142L14.2929 15.7071C14.6834 16.0976 15.3166 16.0976 15.7071 15.7071C16.0976 15.3166 16.0976 14.6834 15.7071 14.2929L13.4142 12L15.7071 9.70711C16.0976 9.31658 16.0976 8.68342 15.7071 8.29289C15.3166 7.90237 14.6834 7.90237 14.2929 8.29289L12 10.5858L9.70711 8.29289Z"
                className="fill-red9"
              />
            ))}
        </svg>
      </div>
      {children}
    </button>
  );
}

export const CodeQuiz = ({ children, useKey = false }) => {
  const [showAnswer, setShowAnswer] = React.useState(false);
  return (
    <div className="bg-gray4 rounded-lg ring-1 ring-black/15">
      <p className="font-sans font-medium p-4 pb-0">
        What does the console look like after "Change Key" is pressed?{" "}
      </p>
      <div className="grid grid-cols-2 p-4 gap-4">
        <AnswerButton
          onClick={() => setShowAnswer(true)}
          showAnswer={showAnswer}
          isCorrect={!useKey}
        >
          <span>$</span>
          <span>mounted</span>
        </AnswerButton>
        <AnswerButton
          onClick={() => setShowAnswer(true)}
          showAnswer={showAnswer}
          isCorrect={useKey}
        >
          <span>$</span>
          <span className="flex flex-col">
            <span>mounted</span>
            <span>unmounted</span>
            <span>mounted</span>
          </span>
        </AnswerButton>
      </div>
      {showAnswer && (
        <motion.figcaption
          className="block p-4 pt-0"
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: -8 }}
          transition={{ type: "spring", damping: 20 }}
        >
          {children}
        </motion.figcaption>
      )}
    </div>
  );
};
