"use client";

import { type MotionValue, motion } from "framer-motion";
import React from "react";

import { cn } from "~/lib/cn";

import { PADDING, SQUARE_RADIUS, SvgSquare } from "../styles";

export type SizeDiagramProps = {
  scale: MotionValue<number>;
  onWidthChange?: (width: number) => void;
  padding?: number;
};

const squareY = `calc(50% - ${SQUARE_RADIUS}px)`;

export const SizeDiagram = ({
  scale,
  onWidthChange,
  padding = PADDING,
}: SizeDiagramProps) => {
  const [width, setWidth] = React.useState(SQUARE_RADIUS * 2);

  const svgRef = React.useRef<SVGSVGElement>(null);
  const finalRef = React.useRef<SVGRectElement>(null);

  React.useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const { width } = el.getBoundingClientRect();
    setWidth(width - padding * 2);
  }, [padding]);

  const lineRef = React.useRef<SVGLineElement>(null);
  const textRef = React.useRef<SVGTextElement>(null);

  const updateRefs = React.useCallback(
    (value: number) => {
      finalRef.current?.setAttribute("width", (value * width).toString());
      lineRef.current?.setAttribute("x2", (value * width - 2).toString());
      textRef.current?.setAttribute("x", ((width * value) / 2).toString());
      if (textRef.current) {
        textRef.current.textContent = `scale(${value.toFixed(2)})`;
      }
    },
    [width],
  );

  React.useEffect(() => {
    if (onWidthChange) {
      onWidthChange(width);
    }
  }, [width, onWidthChange]);

  React.useEffect(() => {
    updateRefs(scale.get());
    return scale.onChange(updateRefs);
  }, [updateRefs, scale]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      role="img"
      aria-label="Size and scale diagram"
    >
      <foreignObject
        width={width}
        x={padding}
        y={squareY}
        height={SQUARE_RADIUS * 2}
        className="drop-shadow-sm"
      >
        <div
          className={cn(
            "h-full w-full rounded-md border border-gray8",
            "bg-[repeating-linear-gradient(-45deg,theme(colors.gray8),theme(colors.gray8)_8px,transparent_8px,transparent_16px)]",
          )}
        />
      </foreignObject>
      <SvgSquare ref={finalRef} x={padding} y={squareY} />
      <motion.g style={{ x: padding, y: squareY }}>
        <line
          ref={lineRef}
          x1="2"
          y1="2"
          y2="118"
          className="stroke-blue8 stroke-1 [stroke-dasharray:6]"
        />
        <motion.text
          ref={textRef}
          y={64}
          textAnchor="middle"
          className="fill-blue11 font-mono text-sm"
        >
          scale(1.00)
        </motion.text>
      </motion.g>
    </svg>
  );
};
