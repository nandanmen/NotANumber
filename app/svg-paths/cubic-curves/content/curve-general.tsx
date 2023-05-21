import React from "react";
import type { PointsGroup } from "app/svg-paths/components/drag-group";
import { useSvgContext } from "app/svg-paths/components/svg";
import { CubicPlayground } from "./cubic-playground";

function CurveGeneral() {
  const { getRelative } = useSvgContext();
  const [points, set] = React.useState<PointsGroup>([
    [0, 5],
    [20, 5],
    [15, 13],
  ]);
  return (
    <g>
      <g className="text-gray8">
        <path
          d="M 5 13 Q 10 5 15 13"
          fill="none"
          strokeWidth={getRelative(1.25)}
          stroke="currentColor"
        />
        <g
          strokeWidth={getRelative(0.75)}
          stroke="currentColor"
          strokeDasharray={`${getRelative(1.5)} ${getRelative(1)}`}
        >
          <line x1="5" y1="13" x2="10" y2="5" />
          <line x1="15" y1="13" x2="10" y2="5" />
        </g>
        <circle
          className="fill-gray6"
          r={getRelative(1)}
          cx="10"
          cy="5"
          stroke="currentColor"
          strokeWidth={getRelative(0.5)}
        />
      </g>
      <CubicPlayground points={points} set={({ points }) => set(points)} />
    </g>
  );
}

export const page = {
  children: <CurveGeneral />,
  svg: 20,
};
