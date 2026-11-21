import { useStateContext as useStateContextBase } from "../components/state-context";
import { getInitialPracticeQuestionState } from "../components/path-practice";
import { parsePath } from "../lib/path";
import * as ellipse from "./content/ellipse";
import * as smallEllipse from "./content/small-ellipse";
import * as rotation from "./content/rotation";
import * as flags from "./content/flags";
import { createInitialState } from "../components/svg/drag-group";

const practicePath = parsePath(
  "M 3 15 q 1.5 -2 1.5 -5 q 0 -2 1.5 -4 M 8 4 a 8 8 0 0 1 12 6 q 0.5 4 -2 9 M 13 21 q 1.5 -2 2 -5 M 16 12 v -1 a 4 4 0 0 0 -8 0 q 0 4 -2.5 7 M 8.5 20 q 3 -3 3.5 -9"
);

const path = parsePath("M 3 10 A 10 7.5 0 0 0 20 15");

export const syntaxState = {
  ...createInitialState(),
  index: null,
  expanded: false,
  path,
};

const state = {
  syntax: syntaxState,
  ellipse: ellipse.initialState,
  "small-ellipse": smallEllipse.initialState,
  rotation: rotation.initialState,
  flags: flags.initialState,
  ...getInitialPracticeQuestionState(practicePath),
};

export const initialState = state;

export const useStateContext = <Key extends keyof typeof initialState>(
  key: Key
) => {
  return useStateContextBase<typeof initialState>()(key);
};
