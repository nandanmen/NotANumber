import { useStateContext as useStateContextBase } from "../components/state-context";
import { parsePath } from "../lib/path";

const heart = `M11.995 7.23319
C10.5455 5.60999 8.12832 5.17335 6.31215 6.65972
C4.4959 8.14609 4.2403 10.6312 5.66654 12.3892
L11.995 18.25
L18.3235 12.3892
C19.7498 10.6312 19.5253 8.13046 17.6779 6.65972
C15.8305 5.18899 13.4446 5.60999 11.995 7.23319
Z`;

const heartPath = parsePath(heart);

export const initialState = {
  intro: {
    toggled: false,
  },
  commands: {
    path: heartPath,
    index: null,
    maxIndex: heartPath.commands.length,
  },
  absolute: {
    path: parsePath("M 10 10 L 5 5 M 10 10 l 5 5"),
    index: null,
    highlight: [1, 3],
  },
};

export const useStateContext = <Key extends keyof typeof initialState>(
  key: Key
) => {
  return useStateContextBase<typeof initialState>()(key);
};
