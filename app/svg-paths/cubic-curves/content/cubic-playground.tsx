import { motion } from "framer-motion";
import { CoordinatesTooltip } from "../../components/svg/tooltip";
import { DraggableEndpoint } from "../../components/draggable-endpoint";
import { useSvgContext } from "../../components/svg";
import {
  type DragGroupState,
  type PointsGroup,
  getDragPoints,
} from "app/svg-paths/components/drag-group";

type CubicPlaygroundProps = {
  points: PointsGroup;
  state?: DragGroupState["state"];
  set?: (state: Partial<DragGroupState>) => void;
  tooltip?: boolean;
};

export function CubicPlayground({
  state,
  set,
  points,
  tooltip = false,
}: CubicPlaygroundProps) {
  const [[x1, y1], [x2, y2], [x, y]] = points;
  const { getRelative } = useSvgContext();
  const props = getDragPoints({
    points,
    state,
    set,
  });
  return (
    <g>
      <g className="stroke-gray10" strokeWidth={getRelative(0.75)}>
        <line x1={5} y1={13} x2={x1} y2={y1} />
        <line x1={x} y1={y} x2={x2} y2={y2} />
      </g>
      <motion.path
        d={`M 5 13 C ${x1} ${y1} ${x2} ${y2} ${x} ${y}`}
        strokeWidth={getRelative(1.25)}
        stroke="currentColor"
        fill="none"
        animate={{ pathLength: 1 }}
        initial={{ pathLength: 0 }}
        transition={{ type: "spring", bounce: 0 }}
      />
      <circle fill="currentColor" r={getRelative(1)} cx={5} cy={13} />
      {props.map(({ x, y, on }, index) => {
        return <DraggableEndpoint key={index} cx={x} cy={y} />;
      })}
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
