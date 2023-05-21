import {
  createInitialState,
  DragGroup,
  DragGroupState,
} from "app/svg-paths/components/drag-group";
import { useStateContext } from "app/svg-paths/components/state-context";

function ArcSyntax() {
  const {
    data: { points },
  } = useStateContext<DragGroupState>("syntax");
  return <DragGroup source="syntax" />;
}

export const initialState = createInitialState([[20, 20]]);

export const page = {
  children: <ArcSyntax />,
};
