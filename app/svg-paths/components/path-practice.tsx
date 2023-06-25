import React from "react";
import { CommandListFromSource } from "./command-list";
import type { Path as IPath } from "../lib/path";
import { type Command, parsePath } from "../utils";
import { Button } from "./button";
import { PathEditor } from "./path-editor";
import { PathList } from "./path-hover-visual";
import { useStateContext } from "./state-context";
import { useSvgContext } from "./svg";
import { Path } from "./svg/path";
import { PathVisualizer } from "./path-visualizer";

const PRACTICE_QUESTION_KEY = "practiceQuestion";

export type PracticeQuestionState = {
  path: IPath;
  showAnswer: boolean;
  value: string;
  index: number | null;
};

export function getInitialPracticeQuestionState(path: IPath) {
  return {
    [PRACTICE_QUESTION_KEY]: {
      path,
      showAnswer: false,
      value: "",
      index: null,
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
    data: { path, showAnswer, value, index },
  } = useStateContext<Record<string, PracticeQuestionState>>()(
    PRACTICE_QUESTION_KEY
  );
  const { getRelative } = useSvgContext();
  return (
    <g>
      <Path
        strokeWidth={getRelative(2)}
        className="stroke-gray8"
        fill="none"
        d={path.toPathString()}
      />
      <PathPractice value={value} />
      {showAnswer && <PathList commands={path.absolute} index={index} />}
    </g>
  );
}

// This component is imported into MDX
export function PracticeQuestionEditor() {
  const {
    data: { showAnswer },
    set,
  } = useStateContext<Record<string, PracticeQuestionState>>()(
    PRACTICE_QUESTION_KEY
  );
  return (
    <div className="space-y-2">
      <PathEditor id={PRACTICE_QUESTION_KEY} placeholder="M 5 10" />
      <Button onClick={() => set({ showAnswer: !showAnswer })}>
        {showAnswer ? "Hide Answer" : "Reveal Answer"}
      </Button>
      {showAnswer && <CommandListFromSource source={PRACTICE_QUESTION_KEY} />}
    </div>
  );
}
