import React from "react";
import { motion } from "framer-motion";

import { styled } from "~/stitches.config";

export const QuizContext = React.createContext(null);

export const Quiz = ({ label, answer, children }) => {
  const [selected, select] = React.useState(null);
  const isCorrect = selected === answer;

  React.useEffect(() => {
    if (isCorrect) {
      const spoilers = document.querySelectorAll(
        `[data-spoiler-for="${label}"]`
      );
      spoilers.forEach((spoiler) =>
        spoiler.setAttribute("data-revealed", "true")
      );
    }
  }, [isCorrect, label]);

  return (
    <QuizWrapper id={label} data-answered={isCorrect}>
      <QuizContext.Provider value={{ selected, select, answer: answer }}>
        {children}
      </QuizContext.Provider>
    </QuizWrapper>
  );
};

const QuizWrapper = styled(motion.div, {
  padding: "$4",
  borderRadius: "$base",
  border: "1px solid $gray8",
  lineHeight: 1.6,

  "& > *:not(:last-child)": {
    marginBottom: "$2",
  },
});

const Question = (props) => {
  return <div>{props.children}</div>;
};

const Options = (props) => {
  return <OptionsWrapper>{props.children}</OptionsWrapper>;
};

const OptionsWrapper = styled("div", {
  display: "flex",
  gap: "$2",
});

const Option = ({ label, children }) => {
  const { selected, select } = React.useContext(QuizContext);
  return (
    <OptionWrapper
      onClick={() => select(label)}
      data-active={selected === label}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </OptionWrapper>
  );
};

const OptionWrapper = styled(motion.button, {
  border: "1px solid $gray8",
  background: "$gray1",
  padding: "$1 $2",
  borderRadius: 4,
  flex: 1,
  display: "flex",
  justifyContent: "center",

  '&[data-active="true"], &:hover': {
    background: "$blue6",
    borderColor: "$blue8",
  },
});

const Tip = ({ htmlFor, children }) => {
  const { selected, answer } = React.useContext(QuizContext);

  if (selected !== htmlFor) {
    return null;
  }

  const isCorrect = answer === htmlFor;
  return (
    <TipWrapper
      correct={isCorrect}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {children}
    </TipWrapper>
  );
};

const TipWrapper = styled(motion.div, {
  padding: "$2",
  background: "$gray4",
  border: "1px solid $gray7",
  borderRadius: 4,

  variants: {
    correct: {
      true: {
        background: "$green4",
        borderColor: "$green7",
      },
    },
  },
});

const Spoiler = ({ htmlFor, children }) => {
  const [revealed, setRevealed] = React.useState(false);

  React.useEffect(() => {
    const quiz = document.querySelector(`#${htmlFor}[data-answered="true"]`);
    if (quiz) {
      setRevealed(true);
    }
  }, [htmlFor]);

  return (
    <SpoilerWrapper
      onClick={() => setRevealed(true)}
      data-revealed={revealed}
      data-spoiler-for={htmlFor}
    >
      {children}
    </SpoilerWrapper>
  );
};

const SpoilerWrapper = styled("button", {
  position: "relative",

  "&:after": {
    content: "",
    position: "absolute",
    inset: 0,
    background: "$gray7",
    opacity: 1,
    transition: "opacity 0.2s ease-out",
  },

  "&[data-revealed='true']:after": {
    opacity: 0,
  },
});

Quiz.Question = Question;
Quiz.Option = Option;
Quiz.Options = Options;
Quiz.Tip = Tip;
Quiz.Spoiler = Spoiler;
