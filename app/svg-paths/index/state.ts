import { useStateContext as useStateContextBase } from "../components/state-context";

export const initialState = {
  intro: {
    toggled: false,
  },
};

export const useStateContext = <Key extends keyof typeof initialState>(
  key: Key
) => {
  return useStateContextBase<typeof initialState>()(key);
};
