"use client";

import { transitions } from "app/notes/(content)/diagram/_components/workflows/transitions";
import { motion } from "motion/react";
import { CONNECTOR_MARKER_ID } from "../../grid-background";
import { useGridSize } from "../../grid-context";

export function Connectors() {
  return (
    <div className="absolute inset-0 translate-x-px">
      <svg width="100%" height="100%" aria-hidden="true" className="text-gray8">
        <Path x1={3} y1={1} x2={4} y2={2} />
        <Path x1={5} y1={1} x2={4} y2={2} />
        <Path x1={4} y1={4} x2={4} y2={5} />
        <Path x1={4} y1={7} x2={4} y2={9} direction="vertical-first" />
        <Path x1={4} y1={7} x2={2} y2={8} direction="vertical-first" />
        <Path x1={4} y1={7} x2={6} y2={8} direction="vertical-first" />
      </svg>
    </div>
  );
}

export function GridPath({ points }: { points: [number, number][] }) {
  const { gridSize } = useGridSize();
  if (gridSize == null || points.length < 2) return null;

  const r = gridSize * 0.25;
  const pts = points.map(([x, y]) => [x * gridSize, y * gridSize] as const);

  const parts: string[] = [`M ${pts[0][0]} ${pts[0][1]}`];

  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i - 1];
    const [cx, cy] = pts[i];
    const [nx, ny] = pts[i + 1];

    // Direction vectors into and out of the corner
    const dxIn = cx - px;
    const dyIn = cy - py;
    const dxOut = nx - cx;
    const dyOut = ny - cy;
    const lenIn = Math.sqrt(dxIn * dxIn + dyIn * dyIn);
    const lenOut = Math.sqrt(dxOut * dxOut + dyOut * dyOut);

    // Clamp radius so it doesn't exceed half of either segment
    const maxR = Math.min(lenIn / 2, lenOut / 2, r);

    // Point just before the corner
    const bx = cx - (dxIn / lenIn) * maxR;
    const by = cy - (dyIn / lenIn) * maxR;
    // Point just after the corner
    const ax = cx + (dxOut / lenOut) * maxR;
    const ay = cy + (dyOut / lenOut) * maxR;

    // Sweep flag: use cross product to determine turn direction
    const cross = dxIn * dyOut - dyIn * dxOut;
    const sweep = cross > 0 ? 1 : 0;

    parts.push(`L ${bx} ${by}`);
    parts.push(`A ${maxR} ${maxR} 0 0 ${sweep} ${ax} ${ay}`);
  }

  parts.push(`L ${pts[pts.length - 1][0]} ${pts[pts.length - 1][1]}`);

  return (
    <path
      d={parts.join(" ")}
      stroke="currentColor"
      strokeWidth="3"
      fill="none"
      markerStart={`url(#${CONNECTOR_MARKER_ID})`}
      markerEnd={`url(#${CONNECTOR_MARKER_ID})`}
    />
  );
}

export function Path({
  x1,
  y1,
  x2,
  y2,
  radius: radiusProp,
  direction = "horizontal-first",
  id,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  radius?: number;
  direction?: "horizontal-first" | "vertical-first" | "direct";
  id?: string;
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
    direction === "direct"
      ? `M ${startX} ${startY} L ${endX} ${endY}`
      : radius <= 0
        ? direction === "vertical-first"
          ? `M ${startX} ${startY} V ${endY} L ${endX} ${endY}`
          : `M ${startX} ${startY} H ${endX} L ${endX} ${endY}`
        : direction === "vertical-first"
          ? `M ${startX} ${startY} L ${startX} ${vEnd} A ${radius} ${radius} 0 0 ${sweepVH} ${hStart} ${endY} L ${endX} ${endY}`
          : `M ${startX} ${startY} L ${hEnd} ${startY} A ${radius} ${radius} 0 0 ${sweepHV} ${endX} ${vStart} L ${endX} ${endY}`;

  return (
    <g id={id}>
      <path
        d={d}
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        markerStart={`url(#${CONNECTOR_MARKER_ID})`}
        markerEnd={`url(#${CONNECTOR_MARKER_ID})`}
      />
    </g>
  );
}
