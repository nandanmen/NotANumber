import { useStateContext } from "../../components/state-context";
import type { SyntaxState } from "../types";
import { CubicPlayground } from "./cubic-playground";

function Syntax() {
  const { data, set } = useStateContext<SyntaxState>("syntax");
  return <CubicPlayground coords={data} state={data.state} set={set} tooltip />;
}

export const initialState: SyntaxState = {
  state: "idle",
  active: null,
  x1: 0,
  y1: 5,
  x2: 20,
  y2: 5,
  x: 15,
  y: 13,
};

export const page = {
  children: <Syntax />,
  svg: 20,
};
