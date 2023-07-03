import { useStateContext as useStateContextBase } from "../components/state-context";
import { getInitialPracticeQuestionState } from "../components/path-practice";
import { parsePath } from "../lib/path";
import { createInitialState } from "../components/svg/drag-group";

export const initialState = {
  intro: parsePath(
    "M 5 5 q 5 -3 10 0 M 5 10 c 5 -3 5 3 10 0 M 5 15 a 5 3 0 0 0 10 0"
  ),
  curve: {
    path: parsePath("M 5 0 v 5 Q 5 15 15 15 h 5"),
    ...createInitialState(),
  },
  chain: {
    path: parsePath("M 5 5 Q 5 10 10 10 T 15 15"),
    ...createInitialState(),
  },
  ...getInitialPracticeQuestionState(
    parsePath(
      "M 5 17 Q 10 8 15 17 M 10 12.5 Q 15 5 20 12.5 M 5 5 v 15 h 15 v -15 z"
    )
  ),
};

export const useStateContext = <Key extends keyof typeof initialState>(
  key: Key
) => {
  return useStateContextBase<typeof initialState>()(key);
};
