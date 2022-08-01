export type Pushable = {
  push(state: unknown): void;
};

export type Fn = {
  (...args: any[]): any;
};

export type AlgorithmOptions = {
  delay: number;
  loop: boolean;
};

export type AlgorithmContext = {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  next(): void;
  prev(): void;
  reset(): void;
  toggle(): void;
  goTo(step: number): void;
};

export type SnapshottedAlgorithm<Algorithm extends Fn> = {
  entryPoint: (snapshots: Pushable) => Algorithm;
  params: string;
  code: string;
};

export type StateMetadata<ReturnType> = {
  __done?: boolean;
  __returnValue?: ReturnType;
};
