"use client";

import type { ComponentProps, ReactNode } from "react";
import { cn } from "~/lib/cn";
import { Path } from "./connectors";
import { GridCell } from "./grid-cell";

type Node = {
  x: number;
  y: number;
  width?: number;
  height?: number;
  content: ReactNode;
};

type Edge = [fromIndex: number, toIndex: number];

type NetworkDiagramProps = {
  nodes: Node[];
  edges: Edge[];
  className?: string;
  children?: ReactNode;
};

function getNodeCenter(node: Node) {
  const w = node.width ?? 2;
  const h = node.height ?? 2;
  return { cx: node.x + w / 2, cy: node.y + h / 2, hw: w / 2, hh: h / 2 };
}

function getEdgePoint(
  from: ReturnType<typeof getNodeCenter>,
  to: ReturnType<typeof getNodeCenter>,
) {
  const dx = to.cx - from.cx;
  const dy = to.cy - from.cy;
  if (dx === 0 && dy === 0) return { x: from.cx, y: from.cy };

  const tx = dx !== 0 ? from.hw / Math.abs(dx) : Infinity;
  const ty = dy !== 0 ? from.hh / Math.abs(dy) : Infinity;
  const t = Math.min(tx, ty);
  return { x: from.cx + dx * t, y: from.cy + dy * t };
}

export function NetworkDiagram({
  nodes,
  edges,
  className,
  children,
}: NetworkDiagramProps) {
  return (
    <div className={cn("relative w-full h-full", className)}>
      <svg
        width="100%"
        height="100%"
        aria-hidden="true"
        className="text-gray8 absolute inset-0 overflow-visible"
      >
        {edges.map(([from, to]) => {
          const a = getNodeCenter(nodes[from]);
          const b = getNodeCenter(nodes[to]);
          const start = getEdgePoint(a, b);
          const end = getEdgePoint(b, a);
          return (
            <Path
              key={`${from}-${to}`}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              direction="direct"
            />
          );
        })}
        {children}
      </svg>
      {nodes.map((node, i) => (
        <GridCell
          key={i}
          className="absolute"
          width={node.width}
          height={node.height}
          margin={{ left: node.x, top: node.y }}
        >
          {node.content}
        </GridCell>
      ))}
    </div>
  );
}
