import { useStateContext as useStateContextBase } from "../components/state-context";
import { getInitialPracticeQuestionState } from "../components/path-practice";
import { parsePath } from "../lib/path";
import { createInitialState } from "../components/svg/drag-group";

export const initialState = {
  syntax: {
    path: parsePath("M 5 13 C 0 5 20 5 15 13"),
    ...createInitialState(),
  },
  chain: {
    path: parsePath(
      "M 6 10 C 6 8 4 10 4 5 S 11 0 11 5 S 9 8 9 10 Z M 6.25 10 v 1.5 h -0.25 v 1 q 0 1 1 1 h 1 q 1 0 1 -1 v -1 h -3 m 2.75 0 v -1.5"
    ),
    index: null,
    expanded: false,
    highlight: [1, 2, 3],
    collapseAfter: 4,
    ...createInitialState(),
  },
  ...getInitialPracticeQuestionState(
    parsePath(
      "M 10 18 c -10 -1 -10 -14 0 -15 q 6 -0.75 8 5 c 7 0 7 10 0 10 m -1.0 -2 v 6 m -2.0 -4.5 v 6 m -2.0 -6 v 6 m -2.0 -7.5 v 6"
    )
  ),
};

export const useStateContext = <Key extends keyof typeof initialState>(
  key: Key
) => {
  return useStateContextBase<typeof initialState>()(key);
};
