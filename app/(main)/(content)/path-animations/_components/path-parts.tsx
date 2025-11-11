import { useId } from "react";

export function PathParts({
  d,
  className = "text-blue9",
  pointFill = false,
}: {
  d: string;
  className?: string;
  pointFill?: boolean;
}) {
  const id = useId();
  return (
    <g className={className}>
      <defs>
        <marker id={id} markerWidth="4" markerHeight="4" refX="2" refY="2">
          <circle
            cx="2"
            cy="2"
            r="1.5"
            fill={pointFill ? "currentColor" : "white"}
            stroke="currentColor"
            strokeWidth="0.5"
          />
        </marker>
      </defs>
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="0.1"
        markerStart={`url(#${id})`}
        markerMid={`url(#${id})`}
        markerEnd={`url(#${id})`}
      />
    </g>
  );
}
