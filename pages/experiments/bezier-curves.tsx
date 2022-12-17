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

export default function BezierCurvesPage() {
  const [key, setKey] = React.useState(0);
  const [easing, setEasing] = React.useState([0.62, 0, 0.18, 1]);
  const [debug, setDebug] = React.useState(false);

  const handleEasingPan = (index: number) => (value: number) => {
    if (!(index % 2)) {
      value = Math.max(0, Math.min(1, value));
    }
    if (value === easing[index]) return;
    setEasing((_easing) =>
      produce(_easing, (draft) => {
        draft[index] = value;
      })
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
          <Row css={{ gap: "$1" }}>
            {easing.map((value, index) => {
              return (
                <ButtonSlider
                  key={index}
                  onValueChange={handleEasingPan(index)}
                  value={value}
                  css={{
                    "--text-color": "var(--colors-gray11)",
                    "--active-color": "var(--colors-gray8)",
                    padding: "$1",
                    background: "$gray3",
                    borderRadius: 4,
                  }}
                />
              );
            })}
          </Row>
        </DebugField>
      </Controls>
    </ExperimentsPage>
  );
}
