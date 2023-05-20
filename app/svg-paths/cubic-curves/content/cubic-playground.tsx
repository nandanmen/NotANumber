import { motion } from "framer-motion";
import { CoordinatesTooltip } from "../../components/svg/tooltip";
import { DraggableEndpoint } from "../../components/draggable-endpoint";
import { useSvgContext } from "../../components/svg";
import type { SyntaxState } from "../types";

type CubicPlaygroundProps = {
  state?: SyntaxState["state"];
  set?: (state: Partial<SyntaxState>) => void;
  coords: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    x: number;
    y: number;
  };
  tooltip?: boolean;
};

export function CubicPlayground({
  state,
  set,
  coords,
  tooltip = false,
}: CubicPlaygroundProps) {
  const { x1, y1, x2, y2, x, y } = coords;
  const { getRelative } = useSvgContext();

  const getHandlers = (name: SyntaxState["active"]) => {
    if (!state || !set) return {};
    return {
      hoverStart: () => {
        if (state !== "idle") return;
        set({ state: "hovering", active: name });
      },
      hoverEnd: () => {
        if (state !== "hovering") return;
        set({ state: "idle", active: null });
      },
      panStart: () => {
        set({ state: "panning", active: name });
      },
      panEnd: () => {
        set({ state: "idle", active: null });
      },
    };
  };

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
      <DraggableEndpoint
        cx={x1}
        cy={y1}
        on={{
          ...getHandlers("x1"),
          pan: (x, y) => set({ x1: x, y1: y }),
        }}
      />
      <DraggableEndpoint
        cx={x2}
        cy={y2}
        on={{
          ...getHandlers("x2"),
          pan: (x, y) => set({ x2: x, y2: y }),
        }}
      />
      <DraggableEndpoint
        cx={x}
        cy={y}
        on={{
          ...getHandlers("x"),
          pan: (x, y) => set({ x, y }),
        }}
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
