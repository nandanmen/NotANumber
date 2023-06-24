import { useStateContext as useStateContextBase } from "../components/state-context";
import { getInitialPracticeQuestionState } from "../components/path-practice";
import { parsePath } from "../lib/path";
import { createInitialState } from "../components/svg/drag-group";

const heart = `M11.995 7.23319
C10.5455 5.60999 8.12832 5.17335 6.31215 6.65972
C4.4959 8.14609 4.2403 10.6312 5.66654 12.3892
L11.995 18.25
L18.3235 12.3892
C19.7498 10.6312 19.5253 8.13046 17.6779 6.65972
C15.8305 5.18899 13.4446 5.60999 11.995 7.23319
Z`;

const heartPath = parsePath(heart);

const cornerPath = parsePath("M 5 5 v 5 L 10 15 h 5");

export const initialState = {
  intro: {
    path: heartPath,
    index: null,
    maxIndex: heartPath.commands.length,
  },
  corner: {
    path: cornerPath,
    index: null,
    maxIndex: cornerPath.commands.length,
  },
  absolute: {
    path: parsePath("M 5 5 L 10 15"),
    ...createInitialState(),
  },
  relative: {
    path: parsePath("M 15 5 l 10 15"),
    ...createInitialState(),
  },
  move: {
    path: parsePath("M 3 5.5 q 2 2 0 4 m 3 -6 q 4 4 0 8 m 3 -10 q 4 6 0 12"),
  },
  ...getInitialPracticeQuestionState(
    parsePath("M 0 5 m 5 10 m 5 -5 m 5 0 m 5 -10")
  ),
};

export const useStateContext = <Key extends keyof typeof initialState>(
  key: Key
) => {
  return useStateContextBase<typeof initialState>()(key);
};
