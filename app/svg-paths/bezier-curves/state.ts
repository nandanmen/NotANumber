import { useStateContext as useStateContextBase } from "../components/state-context";
import { getInitialPracticeQuestionState } from "../components/path-practice";
import { parsePath } from "../lib/path";

export const initialState = {
  curve: {
    x1: 5,
    y1: 15,
    x: 15,
    y: 15,
  },
  chain: {
    x1: 5,
    y1: 10,
    x: 10,
    y: 10,
    tx: 15,
    ty: 15,
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
