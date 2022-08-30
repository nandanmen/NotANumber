import React from "react";
import { motion } from "framer-motion";

import { styled } from "~/stitches.config";

export const QuizContext = React.createContext(null);

export const Quiz = (props) => {
  const [selected, select] = React.useState(null);
  return (
    <QuizWrapper id={props.label}>
      <QuizContext.Provider value={{ selected, select, answer: props.answer }}>
        {props.children}
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

const Option = (props) => {
  const { selected, select } = React.useContext(QuizContext);
  return (
    <OptionWrapper
      onClick={() => select(props.label)}
      data-active={selected === props.label}
    >
      {props.children}
    </OptionWrapper>
  );
};

const OptionWrapper = styled("button", {
  border: "1px solid $gray8",
  background: "$gray1",
  padding: "$1 $2",
  borderRadius: 4,
  flex: 1,
  display: "flex",
  justifyContent: "center",

  '&[data-active="true"], &:hover': {
    background: "$blue5",
    borderColor: "$blue7",
  },
});

const Tip = ({ htmlFor, children }) => {
  const { selected, answer } = React.useContext(QuizContext);

  if (selected !== htmlFor) {
    return null;
  }

  const isCorrect = answer === htmlFor;
  return <TipWrapper correct={isCorrect}>{children}</TipWrapper>;
};

const TipWrapper = styled(motion.div, {
  padding: "$2",
  background: "$yellow4",
  border: "1px solid $yellow7",
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

const Spoiler = (props) => {
  return <span>{props.children}</span>;
};

Quiz.Question = Question;
Quiz.Option = Option;
Quiz.Options = Options;
Quiz.Tip = Tip;
Quiz.Spoiler = Spoiler;
