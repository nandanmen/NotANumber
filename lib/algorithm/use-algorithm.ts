import React from "react";
import useInterval from "@use-it/interval";

import { exec } from "./exec";
import type {
  AlgorithmContext,
  Fn,
  SnapshottedAlgorithm,
  AlgorithmOptions,
} from "./types";

const DEFAULT_ALGORITHM_OPTIONS: AlgorithmOptions = {
  delay: 500,
  loop: false,
  onDone: () => {},
};

type BaseState = {
  __done?: boolean;
};

export const useAlgorithm = <StateType, FnType extends Fn = Fn>(
  snapshottedAlgorithm: SnapshottedAlgorithm<FnType>,
  inputs: Parameters<FnType>,
  options: Partial<AlgorithmOptions> = {}
): [StateType, AlgorithmContext] => {
  const steps = React.useMemo(
    () =>
      exec<StateType & BaseState, Parameters<FnType>, ReturnType<FnType>>(
        snapshottedAlgorithm.entryPoint,
        inputs
      ),
    [snapshottedAlgorithm, inputs]
  );
  return useStepPlayer(steps, options);
};

export const useStepPlayer = <StateType = unknown>(
  steps: StateType[],
  options: Partial<AlgorithmOptions> = {}
): [StateType, AlgorithmContext] => {
  const _options = { ...DEFAULT_ALGORITHM_OPTIONS, ...options };
  const [activeStepIndex, setActiveStepIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);

  useInterval(
    () => {
      if (activeStepIndex < steps.length - 1) {
        setActiveStepIndex((index) => index + 1);
      } else {
        _options.onDone();
        setIsPlaying(false);
      }
    },
    isPlaying ? _options.delay : null
  );

  const toggle = () => {
    if (activeStepIndex === steps.length - 1) {
      reset();
    }
    setIsPlaying((playing) => !playing);
  };

  const reset = React.useCallback(() => {
    setIsPlaying(false);
    setActiveStepIndex(0);
  }, []);

  const next = () => {
    if (_options.loop) {
      setActiveStepIndex((index) => (index + 1) % steps.length);
    } else if (activeStepIndex < steps.length - 1) {
      setActiveStepIndex((index) => index + 1);
    }
  };

  const prev = () => {
    if (_options.loop && activeStepIndex === 0) {
      setActiveStepIndex(steps.length - 1);
    } else if (activeStepIndex > 0) {
      setActiveStepIndex((index) => index - 1);
    }
  };

  return [
    steps[activeStepIndex],
    {
      currentStep: activeStepIndex,
      totalSteps: steps.length,
      isPlaying,
      reset,
      toggle,
      next,
      prev,
      play: () => {
        if (activeStepIndex === steps.length - 1) {
          reset();
        }
        setIsPlaying(true);
      },
      pause: () => setIsPlaying(false),
      goTo: (step) => {
        if (isPlaying) {
          setIsPlaying(false);
        }
        setActiveStepIndex(step);
      },
    },
  ];
};
