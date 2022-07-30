export type Pushable = {
  push(state: unknown): void;
};

export type Fn = {
  (...args: any[]): any;
};

export type AlgorithmContext = {
  currentStep: number;
  totalSteps: number;
  next(): void;
  prev(): void;
  goTo(step: number): void;
};

export type SnapshottedAlgorithm<Algorithm extends Fn> = {
  entryPoint: (snapshots: Pushable) => Algorithm;
  params: string;
  code: string;
};

export type StateWithMetadata<StateType, ReturnType> = StateType & {
  __done?: boolean;
  __returnValue?: ReturnType;
};
