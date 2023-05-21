import React from "react";
import { type Command, parsePath, toPathString } from "../utils";
import { Button } from "./button";
import { CommandHighlight } from "./command-highlight";
import { PathEditor } from "./path-editor";
import { PathList } from "./path-hover-visual";
import { PathVisualizer } from "./path-visualizer";
import { useStateContext } from "./state-context";
import { useSvgContext } from "./svg";

const PRACTICE_QUESTION_KEY = "practiceQuestion";

export type PracticeQuestionState = {
  commands: string[];
  showAnswer: boolean;
  value: string;
  hoverIndex: number | null;
};

export function getInitialPracticeQuestionState(commands: string[]) {
  return {
    [PRACTICE_QUESTION_KEY]: {
      commands,
      showAnswer: false,
      value: "",
      hoverIndex: null,
    },
  };
}

export function PathPractice({ value }: { value: string }) {
  const [path, setPath] = React.useState<Command[]>([]);

  React.useEffect(() => {
    try {
      const parsed = parsePath(value);
      setPath(parsed);
    } catch {}
  }, [value]);

  return <PathVisualizer path={path} />;
}

export function PracticeQuestion() {
  const {
    data: { commands: question, showAnswer, value, hoverIndex },
  } = useStateContext<PracticeQuestionState>(PRACTICE_QUESTION_KEY);
  const { getRelative } = useSvgContext();

  const path = question.join(" ");
  const commands = React.useMemo(() => {
    return parsePath(path);
  }, [path]);

  return (
    <g>
      <path
        strokeWidth={getRelative(2)}
        className="stroke-gray8"
        fill="none"
        d={toPathString(commands)}
      />
      <PathPractice value={value} />
      {showAnswer && <PathList commands={commands} index={hoverIndex} />}
    </g>
  );
}

// This component is imported into MDX
export function PracticeQuestionEditor() {
  const {
    data: { commands, showAnswer },
    set,
  } = useStateContext<PracticeQuestionState>(PRACTICE_QUESTION_KEY);
  return (
    <div className="space-y-2">
      <PathEditor id={PRACTICE_QUESTION_KEY} placeholder="M 5 10" />
      <Button onClick={() => set({ showAnswer: !showAnswer })}>
        {showAnswer ? "Hide Answer" : "Reveal Answer"}
      </Button>
      {showAnswer && (
        <CommandHighlight
          commands={commands}
          onIndexChange={(index) => set({ hoverIndex: index })}
        />
      )}
    </div>
  );
}
