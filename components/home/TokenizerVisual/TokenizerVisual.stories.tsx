import React from "react";
import { TokenizerVisual } from "./TokenizerVisual";

const Refresh = ({ children }) => {
  const [key, setKey] = React.useState(0);
  const inc = () => setKey(key + 1);
  return (
    <div key={key}>
      <button onClick={inc}>Refresh</button>
      {children}
    </div>
  );
};

export const Default = () => (
  <Refresh>
    <TokenizerVisual />
  </Refresh>
);
