import { DraggableEndpoint } from "app/svg-paths/components/draggable-endpoint";
import { useStateContext } from "app/svg-paths/components/state-context";
import { Path } from "app/svg-paths/components/svg/path";
import { parsePath, type Path as IPath } from "app/svg-paths/lib/path";
import {
  createInitialState,
  DragGroupState,
  getDragHandlers,
} from "./drag-group";

const path = parsePath("M 10 10 A 10 10 0 0 0 20 20");

type SyntaxState = {
  path: IPath;
} & DragGroupState;

function ArcSyntax() {
  const {
    data: { path, state },
    set,
  } = useStateContext<SyntaxState>("syntax");
  const move = path.atAbsolute<"M">(0);
  const arc = path.atAbsolute<"A">(1);
  return (
    <g>
      <Path d={path.toPathString()} />
      <DraggableEndpoint
        cx={arc.x0}
        cy={arc.y0}
        on={{
          ...getDragHandlers({
            id: [`${move.id}.x`, `${move.id}.y`],
            state,
            set,
          }),
          pan: (x, y) => {
            set({ path: path.setAbsolute(0, { x, y }) });
          },
        }}
      />
      <DraggableEndpoint
        cx={arc.x}
        cy={arc.y}
        on={{
          ...getDragHandlers({
            id: [`${arc.id}.x`, `${arc.id}.y`],
            state,
            set,
          }),
          pan: (x, y) => {
            set({ path: path.setAbsolute(1, { x, y }) });
          },
        }}
      />
    </g>
  );
}

export const initialState = {
  ...createInitialState(),
  index: null,
  expanded: false,
  path,
};

export const page = {
  children: <ArcSyntax />,
};
