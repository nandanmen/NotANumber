"use client";

import { useId } from "react";
import { useGridSize } from "../../grid-context";

export function Connectors() {
  const markerId = useId();
  const markerEnd = `url(#${markerId})`;
  const markerStart = `url(#${markerId})`;

  return (
    <div className="absolute inset-0 translate-x-px">
      <svg width="100%" height="100%" aria-hidden="true" className="text-gray8">
        <defs>
          <marker
            id={markerId}
            markerUnits="userSpaceOnUse"
            markerWidth="10"
            markerHeight="10"
            refX="5"
            refY="5"
            orient="auto"
          >
            <circle cx="5" cy="5" r="4" fill="currentColor" />
          </marker>
        </defs>
        <Path
          x1={3}
          y1={1}
          x2={4}
          y2={2.25}
          markerStart={markerStart}
          markerEnd={markerEnd}
        />
        <Path
          x1={5}
          y1={1}
          x2={4}
          y2={2.25}
          markerStart={markerStart}
          markerEnd={markerEnd}
        />
        <Path
          x1={4}
          y1={3.75}
          x2={4}
          y2={5.25}
          markerStart={markerStart}
          markerEnd={markerEnd}
        />
        <Path
          x1={4}
          y1={6.75}
          x2={4}
          y2={9}
          direction="vertical-first"
          markerStart={markerStart}
          markerEnd={markerEnd}
        />
        <Path
          x1={4}
          y1={6.75}
          x2={2}
          y2={8}
          direction="vertical-first"
          markerStart={markerStart}
          markerEnd={markerEnd}
        />
        <Path
          x1={4}
          y1={6.75}
          x2={6}
          y2={8}
          direction="vertical-first"
          markerStart={markerStart}
          markerEnd={markerEnd}
        />
      </svg>
    </div>
  );
}

function Path({
  x1,
  y1,
  x2,
  y2,
  radius: radiusProp,
  direction = "horizontal-first",
  markerStart,
  markerEnd,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  radius?: number;
  direction?: "horizontal-first" | "vertical-first";
  markerStart?: string;
  markerEnd?: string;
}) {
  const { gridSize } = useGridSize();
  if (gridSize == null) return null;

  const toCoords = (n: number) => n * gridSize;
  const [startX, startY, endX, endY] = [x1, y1, x2, y2].map(toCoords);

  const lenH = Math.abs(endX - startX);
  const lenV = Math.abs(endY - startY);
  const maxR = Math.min(lenH, lenV) / 2;
  const radius = Math.min(radiusProp ?? gridSize * 0.5, maxR);

  const sweepHV =
    (endX > startX && endY > startY) || (endX < startX && endY < startY)
      ? 1
      : 0;
  const hEnd = endX > startX ? endX - radius : endX + radius;
  const vStart = endY > startY ? startY + radius : startY - radius;
  const vEnd = endY > startY ? endY - radius : endY + radius;
  const hStart = endX > startX ? startX + radius : startX - radius;
  const sweepVH = sweepHV ? 0 : 1;

  const d =
    radius <= 0
      ? direction === "vertical-first"
        ? `M ${startX} ${startY} V ${endY} L ${endX} ${endY}`
        : `M ${startX} ${startY} H ${endX} L ${endX} ${endY}`
      : direction === "vertical-first"
        ? `M ${startX} ${startY} L ${startX} ${vEnd} A ${radius} ${radius} 0 0 ${sweepVH} ${hStart} ${endY} L ${endX} ${endY}`
        : `M ${startX} ${startY} L ${hEnd} ${startY} A ${radius} ${radius} 0 0 ${sweepHV} ${endX} ${vStart} L ${endX} ${endY}`;

  return (
    <path
      d={d}
      stroke="currentColor"
      strokeWidth="3"
      fill="none"
      markerStart={markerStart}
      markerEnd={markerEnd}
    />
  );
}
