import { CoordinatesTooltip } from "../../components/svg/tooltip";
import type { AbsoluteCommand } from "app/svg-paths/lib/path";
import { DraggableEndpoint } from "app/svg-paths/components/draggable-endpoint";
import {
  DragGroupState,
  getDragHandlers,
} from "app/svg-paths/components/svg/drag-group";
import { Path } from "app/svg-paths/components/svg/path";
import { Line } from "app/svg-paths/components/svg/line";
import { Circle } from "app/svg-paths/components/svg/circle";

type State = DragGroupState & {
  curve: Partial<AbsoluteCommand<"C">>;
};

type CubicPlaygroundProps = {
  curve: AbsoluteCommand<"C">;
  state?: State["state"];
  onChange?: (state: Partial<State>) => void;
  tooltip?: boolean;
};

export function CubicPlayground({
  curve,
  state,
  onChange,
  tooltip = false,
}: CubicPlaygroundProps) {
  const { x1, y1, x, y, x2, y2, x0, y0 } = curve;
  return (
    <g>
      <Line x1={x0} y1={y0} x2={x1} y2={y1} />
      <Line x1={x} y1={y} x2={x2} y2={y2} />
      <Path
        d={curve.toPathSection()}
        animate={{ pathLength: 1 }}
        initial={{ pathLength: 0 }}
        transition={{ type: "spring", bounce: 0 }}
      />
      <Circle cx={x0} cy={y0} variant="cursor" />
      <DraggableEndpoint
        cx={x1}
        cy={y1}
        onPan={(x, y) => {
          onChange?.({ curve: { x1: x, y1: y } });
        }}
        {...getDragHandlers({
          id: ["1.x1", "1.y1"],
          state,
          set: onChange,
        })}
      />
      <DraggableEndpoint
        cx={x2}
        cy={y2}
        onPan={(x, y) => {
          onChange?.({ curve: { x2: x, y2: y } });
        }}
        {...getDragHandlers({
          id: ["1.x2", "1.y2"],
          state,
          set: onChange,
        })}
      />
      <DraggableEndpoint
        cx={x}
        cy={y}
        onPan={(x, y) => {
          onChange?.({ curve: { x, y } });
        }}
        {...getDragHandlers({
          id: ["1.x", "1.y"],
          state,
          set: onChange,
        })}
      />
      {tooltip && (
        <>
          <CoordinatesTooltip x={x1} y={y1} placement="right" />
          <CoordinatesTooltip x={x2} y={y2} placement="left" />
          <CoordinatesTooltip x={x} y={y} placement="bottom" />
        </>
      )}
    </g>
  );
}
