import { useStateContext } from "app/svg-paths/components/state-context";
import { parsePath } from "app/svg-paths/lib/path";
import { ArcSandbox } from "./arc-sandbox";
import { createInitialState } from "./drag-group";
import { SyntaxState } from "./types";

const path = parsePath("M 3 10 A 10 7.5 0 0 0 20 15");

export const initialState = {
  ...createInitialState(),
  blocklist: ["1.xAxisRotation", "1.largeArc", "1.sweep"],
  path,
};

function Ellipse() {
  const { data, set } = useStateContext<SyntaxState>("ellipse");
  return <ArcSandbox {...data} set={set} />;
}

export const page = {
  children: <Ellipse />,
};
