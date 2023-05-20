import produce from "immer";
import React from "react";

const StateContext = React.createContext<{
  state: Record<string, Record<string, unknown>>;
  setState: React.Dispatch<
    React.SetStateAction<Record<string, Record<string, unknown>>>
  >;
}>(null);

export function StateProvider<
  StateType extends Record<string, Record<string, unknown>>
>({ initial, children }: { initial: StateType; children: React.ReactNode }) {
  const [state, setState] = React.useState(initial);
  return (
    <StateContext.Provider value={{ state, setState }}>
      {children}
    </StateContext.Provider>
  );
}

export function useStateContext<Type extends Record<string, unknown>>(
  key: string
) {
  const { state, setState } = React.useContext(StateContext);
  const data = state[key] as Type;

  const set = React.useCallback(
    (data: Partial<Type>) => {
      setState((current) =>
        produce(current, (draft) => {
          if (data === null) {
            draft[key] = null;
            return;
          }
          draft[key] = { ...draft[key], ...data };
        })
      );
    },
    [key, setState]
  );

  return {
    data,
    set,
  };
}
