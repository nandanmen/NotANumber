import { useStateContext as useStateContextBase } from "../components/state-context";
import { getInitialPracticeQuestionState } from "../components/path-practice";
import { parsePath } from "../lib/path";
import * as chain from "./content/chain";
import { createInitialState } from "../components/svg/drag-group";

export const initialState = {
  syntax: {
    path: parsePath("M 5 13 C 0 5 20 5 15 13"),
    ...createInitialState(),
  },
  chain: {
    index: null,
    expanded: false,
  },
  chainDrag: chain.initialState,
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
