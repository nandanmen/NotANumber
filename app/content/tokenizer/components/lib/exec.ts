import rfdc from "rfdc";

const clone = rfdc();

type Pushable = {
  push(state: unknown): void;
};

type StateMetadata<ReturnType> = {
  __done: boolean;
  __returnValue: ReturnType;
};

export function exec<
  StateType,
  ParameterType extends unknown[],
  ReturnValueType
>(
  algorithm: (
    snapshotter: Pushable
  ) => (...args: ParameterType) => ReturnValueType,
  inputs: ParameterType
) {
  const snapshots = [] as Array<
    StateType & Partial<StateMetadata<ReturnValueType>>
  >;
  const returnVal = algorithm({
    push: (state: StateType) => snapshots.push(clone<StateType>(state)),
  })(...inputs);

  const last = snapshots[snapshots.length - 1];
  if (last) {
    last.__done = true;
    last.__returnValue = returnVal;
  }

  return snapshots;
}
