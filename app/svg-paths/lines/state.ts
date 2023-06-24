import { useStateContext as useStateContextBase } from "../components/state-context";
import { getInitialPracticeQuestionState } from "../components/path-practice";
import { parsePath } from "../lib/path";
import { createInitialState } from "../components/svg/drag-group";

export const initialState = {
  absolute: {
    path: parsePath("M 5 5 L 15 10"),
    ...createInitialState(),
  },
  relative: {
    path: parsePath("M 5 5 l 15 10"),
    ...createInitialState(),
  },
  vertical: {
    path: parsePath("M 13 5 h -6 V 15 H 13 M 7 10 h 4"),
  },
  closePath: {
    path: parsePath("M 10 5 l -5 10 h 10 Z"),
  },
  z: { active: false },
  ...getInitialPracticeQuestionState(
    parsePath(
      "M 5 10 l 2.5 -5 h 10 l 2.5 5 h -12.5 v 10 h 5 v -5 h -2.5 v 5 h 7.5 v -10 z"
    )
  ),
};

export const useStateContext = <Key extends keyof typeof initialState>(
  key: Key
) => {
  return useStateContextBase<typeof initialState>()(key);
};
