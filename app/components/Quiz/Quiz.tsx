import React from "react";
import { motion } from "framer-motion";
import { cn } from "~/lib/cn";

export const QuizContext = React.createContext(null);

const QuizRoot = ({ label, answer, children }) => {
  const [selected, select] = React.useState(null);
  const isCorrect = selected === answer;

  React.useEffect(() => {
    if (isCorrect) {
      const spoilers = document.querySelectorAll(
        `[data-spoiler-for="${label}"]`,
      );
      for (const spoiler of spoilers) {
        spoiler.setAttribute("data-revealed", "true");
      }
    }
  }, [isCorrect, label]);

  return (
    <motion.div
      id={label}
      data-answered={isCorrect}
      className="rounded-md border border-gray8 p-4 leading-[1.6] [&>*:not(:last-child)]:mb-2"
    >
      <QuizContext.Provider value={{ selected, select, answer: answer }}>
        {children}
      </QuizContext.Provider>
    </motion.div>
  );
};

export const QuizQuestion = (props) => {
  return <div>{props.children}</div>;
};

const Options = (props) => {
  return <div className="flex gap-2">{props.children}</div>;
};

export const QuizOption = ({ label, children }) => {
  const { selected, select } = React.useContext(QuizContext);
  return (
    <motion.button
      type="button"
      className="flex flex-1 justify-center rounded-[4px] border border-gray8 bg-gray1 px-2 py-1 hover:border-blue8 hover:bg-blue6 data-[active=true]:border-blue8 data-[active=true]:bg-blue6"
      onClick={() => select(label)}
      data-active={selected === label}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
};

export const QuizTip = ({ htmlFor, children }) => {
  const { selected, answer } = React.useContext(QuizContext);

  if (selected !== htmlFor) {
    return null;
  }

  const isCorrect = answer === htmlFor;
  return (
    <motion.div
      className={cn(
        "rounded-[4px] border border-gray7 bg-gray4 p-2",
        isCorrect && "border-green7 bg-green4",
      )}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  );
};

export const QuizSpoiler = ({ htmlFor, children }) => {
  const [revealed, setRevealed] = React.useState(false);

  React.useEffect(() => {
    const quiz = document.querySelector(`#${htmlFor}[data-answered="true"]`);
    if (quiz) {
      setRevealed(true);
    }
  }, [htmlFor]);

  return (
    <button
      type="button"
      className="relative after:absolute after:inset-0 after:bg-gray7 after:opacity-100 after:transition-opacity after:duration-200 after:ease-out after:content-[''] data-[revealed=true]:after:opacity-0"
      onClick={() => setRevealed(true)}
      data-revealed={revealed}
      data-spoiler-for={htmlFor}
    >
      {children}
    </button>
  );
};

export const QuizOptions = Options;

export const Quiz = Object.assign(QuizRoot, {
  Question: QuizQuestion,
  Option: QuizOption,
  Options: QuizOptions,
  Tip: QuizTip,
  Spoiler: QuizSpoiler,
});
