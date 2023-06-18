import { useStateContext as useStateContextBase } from "../components/state-context";
import { getInitialPracticeQuestionState } from "../components/path-practice";
import { parsePath } from "../lib/path";

export const initialState = {
  corner: {
    path: parsePath("M 5 5 v 5 L 10 15 h 5"),
  },
  absolute: { x: 5, y: 5 },
  relative: { x: 15, y: 5 },
  ...getInitialPracticeQuestionState(
    parsePath("M 0 5 m 5 10 m 5 -5 m 5 0 m 5 -10")
  ),
};

export const useStateContext = <Key extends keyof typeof initialState>(
  key: Key
) => {
  return useStateContextBase<typeof initialState>()(key);
};
