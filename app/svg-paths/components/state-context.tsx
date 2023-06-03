import produce from "immer";
import React from "react";

const StateContext = React.createContext<{
  state: Record<string, unknown>;
  setState: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
}>(null);

export function StateProvider<StateType extends Record<string, unknown>>({
  initial,
  children,
}: {
  initial: StateType;
  children: React.ReactNode;
}) {
  const [state, setState] = React.useState(initial);
  return (
    <StateContext.Provider value={{ state, setState }}>
      {children}
    </StateContext.Provider>
  );
}

export function useStateContext<StateType extends Record<string, unknown>>() {
  const { state, setState } = React.useContext(StateContext);
  const _state = state as StateType;
  return <Key extends keyof StateType>(key: Key) => {
    const data = _state[key] as StateType[Key];
    const set = (
      data: StateType[Key] extends object
        ? Partial<StateType[Key]>
        : StateType[Key]
    ) => {
      setState((current) =>
        produce(current, (draft: StateType) => {
          if (data === null) {
            draft[key] = null;
            return;
          }
          if (typeof data === "object") {
            const current = draft[key] as object;
            const update = data as Partial<StateType[Key]>;
            draft[key] = { ...current, ...update } as StateType[Key];
            return;
          }
          draft[key] = data as StateType[Key];
        })
      );
    };
    return { data, set };
  };
}
