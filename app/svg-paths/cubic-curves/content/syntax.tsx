import {
  createInitialState,
  DragGroupState,
} from "app/svg-paths/components/drag-group";
import { useStateContext } from "../../components/state-context";
import { CubicPlayground } from "./cubic-playground";

function Syntax() {
  const { data, set } = useStateContext<DragGroupState>("syntax");
  return <CubicPlayground {...data} set={set} tooltip />;
}

export const initialState = createInitialState([
  [0, 5],
  [20, 5],
  [15, 13],
]);

export const page = {
  children: <Syntax />,
  svg: 20,
};
