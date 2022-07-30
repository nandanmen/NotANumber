import React from "react";

import { exec } from "./exec";
import type { AlgorithmContext, Fn, SnapshottedAlgorithm } from "./types";

export const useAlgorithm = <StateType, FnType extends Fn = Fn>(
  snapshottedAlgorithm: SnapshottedAlgorithm<FnType>,
  inputs: Parameters<FnType>
): [StateType, AlgorithmContext] => {
  const [activeStepIndex, setActiveStepIndex] = React.useState(0);
  const steps = React.useMemo(
    () =>
      exec<StateType, Parameters<FnType>, ReturnType<FnType>>(
        snapshottedAlgorithm.entryPoint,
        inputs
      ),
    [snapshottedAlgorithm, inputs]
  );

  React.useEffect(() => {
    setActiveStepIndex(0);
  }, [steps]);

  return [
    steps[activeStepIndex],
    {
      currentStep: activeStepIndex,
      totalSteps: steps.length,
      next: () =>
        setActiveStepIndex((index) => Math.min(index + 1, steps.length - 1)),
      prev: () => setActiveStepIndex((index) => Math.max(index - 1, 0)),
      goTo: setActiveStepIndex,
    },
  ];
};
