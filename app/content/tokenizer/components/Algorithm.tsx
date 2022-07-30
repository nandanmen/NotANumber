import React from "react";
import { exec } from "./lib/exec";
import { usePlayer } from "./lib/use-player";

export const Algorithm = ({ algorithm, children, initialInputs }) => {
  console.log(algorithm);
  const steps = React.useMemo(
    () => exec(algorithm.entryPoint, initialInputs),
    [algorithm, initialInputs]
  );
  const player = usePlayer(steps);
  return (
    <div>{children({ state: player.models.state, inputs: initialInputs })}</div>
  );
};
