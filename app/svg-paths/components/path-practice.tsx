import React from "react";
import { CommandListFromSource } from "./command-list";
import { AbsoluteCommand, parsePath, Path as IPath } from "../lib/path";
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

export function getInitialPracticeQuestionState(
  path: IPath,
  key = PRACTICE_QUESTION_KEY
) {
  return {
    [key]: {
      path,
      showAnswer: false,
      value: "",
      index: null,
    },
  };
}

export function PathPractice({ value }: { value: string }) {
  const [path, setPath] = React.useState<AbsoluteCommand[]>([]);

  React.useEffect(() => {
    try {
      const parsed = parsePath(value);
      setPath(parsed.absolute);
    } catch {}
  }, [value]);

  return <PathVisualizer path={path} />;
}

export function PracticeQuestion({
  x,
  y,
  questionKey = PRACTICE_QUESTION_KEY,
}: {
  x?: number;
  y?: number;
  questionKey?: string;
}) {
  const {
    data: { path, showAnswer, value, index },
  } = useStateContext<Record<string, PracticeQuestionState>>()(questionKey);
  const { getRelative } = useSvgContext();
  return (
    <g>
      <g transform={`translate(${x}, ${y})`}>
        <Path
          strokeWidth={getRelative(2)}
          className="stroke-gray8"
          fill="none"
          d={path.toPathString()}
        />
      </g>
      <PathPractice value={value} />
      {showAnswer && <PathList commands={path.absolute} index={index} />}
    </g>
  );
}

// This component is imported into MDX
export function PracticeQuestionEditor({
  questionKey = PRACTICE_QUESTION_KEY,
}: {
  questionKey?: string;
}) {
  const {
    data: { showAnswer },
    set,
  } = useStateContext<Record<string, PracticeQuestionState>>()(questionKey);
  return (
    <div className="space-y-4">
      <PathEditor id={questionKey} placeholder="M 5 10" />
      <Button onClick={() => set({ showAnswer: !showAnswer })}>
        {showAnswer ? "Hide Answer" : "Reveal Answer"}
      </Button>
      {showAnswer && <CommandListFromSource source={questionKey} />}
    </div>
  );
}
