"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import React from "react";
import { cn } from "~/lib/cn";
import { range } from "~/lib/utils";

const CELL_SIZE = 8;

type GridProps = {
  rows?: number;
  cols?: number;
  cellSize?: number;
  className?: string;
  children?: React.ReactNode;
};

export const Grid = ({
  rows = 10,
  cols = 15,
  cellSize = CELL_SIZE,
  className = "",
  children,
}: GridProps) => {
  const xMax = cols * cellSize;
  const yMax = rows * cellSize;
  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${xMax} ${yMax}`}
      preserveAspectRatio="none"
      className={className}
    >
      <g className="text-gray6">
        {range(rows)
          .slice(1)
          .map((index) => (
            <line
              key={`row-${index}`}
              x1="0"
              x2={xMax}
              y1={index * cellSize}
              y2={index * cellSize}
              stroke="currentColor"
              strokeWidth="0.2"
            />
          ))}
        {range(cols)
          .slice(1)
          .map((index) => (
            <line
              key={`col-${index}`}
              x1={index * cellSize}
              x2={index * cellSize}
              y1="0"
              y2={yMax}
              stroke="currentColor"
              strokeWidth="0.2"
            />
          ))}
      </g>
      {children}
    </svg>
  );
};

export type GridBackgroundProps = Omit<
  HTMLMotionProps<"div">,
  "children" | "ref"
> & {
  noOverflow?: boolean;
  children?: React.ReactNode;
};

export const GridBackground = React.forwardRef<
  HTMLDivElement,
  GridBackgroundProps
>(function GridBackground(
  { className, noOverflow, children, ...props },
  ref,
) {
  return (
    <motion.div
      ref={ref}
      className={cn(
        "relative border border-gray8 rounded-md bg-[url(/grid.svg)] bg-[length:40px_40px]",
        noOverflow ? "overflow-hidden" : "overflow-auto",
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
});

export const GridOverflowBox = ({ children }: { children: React.ReactNode }) => (
  <GridBackground>
    <div className="flex p-8 pr-0 md:justify-center">
      {children}
      <div className="w-8 shrink-0" />
    </div>
  </GridBackground>
);
