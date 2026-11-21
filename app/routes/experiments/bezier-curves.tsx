import React from "react";
import produce from "immer";
import {
  ExperimentsPage,
  ExperimentWrapper,
  Controls,
  DebugField,
} from "~/components/layout/ExperimentsPage";
import { BezierCurveQuiz } from "~/experiments/BezierCurveQuiz";
import { ButtonSlider } from "~/experiments/EasingFunctionSandbox";
import { Row } from "~/components/layout/Row";
import type { CubicBezier } from "~/experiments/EasingCurveEditor";

export default function BezierCurvesPage() {
  const [key, setKey] = React.useState(0);
  const [easing, setEasing] = React.useState<CubicBezier>([0.62, 0, 0.18, 1]);
  const [debug, setDebug] = React.useState(false);

  const handleEasingPan = (index: number) => (value: number) => {
    if (!(index % 2)) {
      value = Math.max(0, Math.min(1, value));
    }
    if (value === easing[index]) return;
    setEasing((_easing) =>
      produce(_easing, (draft) => {
        draft[index] = value;
      }),
    );
  };

  return (
    <ExperimentsPage page="bezier-curves">
      <ExperimentWrapper>
        <BezierCurveQuiz exampleEasing={easing} debug={debug} />
      </ExperimentWrapper>
      <Controls
        debug={debug}
        onDebugChange={setDebug}
        onReset={() => setKey(key + 1)}
      >
        <DebugField>
          <span>Easing</span>
          <Row className="gap-1">
            {easing.map((value, index) => {
              return (
                <ButtonSlider
                  key={index}
                  onValueChange={handleEasingPan(index)}
                  value={value}
                  className="rounded-[4px] bg-gray3 p-1 [--active-color:var(--color-gray8)] [--text-color:var(--color-gray11)]"
                />
              );
            })}
          </Row>
        </DebugField>
      </Controls>
    </ExperimentsPage>
  );
}
