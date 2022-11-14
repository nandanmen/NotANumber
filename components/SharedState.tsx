import React from "react";

const Context = React.createContext<any>(null);

export const SharedState = ({ initialState, children }) => {
  const [state, setState] = React.useState(initialState);
  return (
    <Context.Provider value={{ state, setState }}>{children}</Context.Provider>
  );
};

export const useSharedState = (defaultValue) => {
  const localState = React.useState(defaultValue);
  const state = React.useContext(Context);

  if (!state) {
    return localState;
  }

  return [state.state, state.setState];
};
