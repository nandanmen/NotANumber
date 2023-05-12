import React from "react";
import { type Command, parsePath } from "../utils";
import { PathVisualizer } from "./path-visualizer";
import { useStateContext } from "./state-context";

export function PathPractice({ id }) {
  const { data: input } = useStateContext<{ value: string }>(id);
  const [path, setPath] = React.useState<Command[]>([]);

  React.useEffect(() => {
    try {
      const parsed = parsePath(input?.value);
      setPath(parsed);
    } catch {}
  }, [input?.value]);

  return <PathVisualizer path={path} />;
}
