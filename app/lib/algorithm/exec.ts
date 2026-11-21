import rfdc from "rfdc";

import type { Pushable, StateMetadata } from "./types";

const clone = rfdc();

export function exec<
  StateType,
  ParameterType extends unknown[],
  ReturnValueType,
>(
  algorithm: (
    snapshotter: Pushable,
  ) => (...args: ParameterType) => ReturnValueType,
  inputs: ParameterType,
) {
  const snapshots = [] as Array<StateType & StateMetadata<ReturnValueType>>;
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
