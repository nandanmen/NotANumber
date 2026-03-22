"use client";

import { transitions } from "app/notes/(content)/diagram/_components/workflows/transitions";
import { type TargetAndTransition, motion } from "motion/react";
import type { CSSProperties, ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "~/lib/cn";

type SpacingValue =
  | number
  | { top?: number; right?: number; bottom?: number; left?: number }
  | { x?: number; y?: number };

function gridCalc(multiplier: number): string {
  return `calc(var(--grid-size) * ${multiplier})`;
}

function getSpacingStyles(
  spacing: SpacingValue | undefined,
  property: "padding" | "margin",
): CSSProperties {
  if (spacing === undefined) return {};

  if (typeof spacing === "number") {
    return { [property]: gridCalc(spacing) };
  }

  if ("x" in spacing || "y" in spacing) {
    const { x, y } = spacing as { x?: number; y?: number };
    return {
      [`${property}Left`]: x !== undefined ? gridCalc(x) : undefined,
      [`${property}Right`]: x !== undefined ? gridCalc(x) : undefined,
      [`${property}Top`]: y !== undefined ? gridCalc(y) : undefined,
      [`${property}Bottom`]: y !== undefined ? gridCalc(y) : undefined,
    };
  }

  const { top, right, bottom, left } = spacing as {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  return {
    [`${property}Top`]: top !== undefined ? gridCalc(top) : undefined,
    [`${property}Right`]: right !== undefined ? gridCalc(right) : undefined,
    [`${property}Bottom`]: bottom !== undefined ? gridCalc(bottom) : undefined,
    [`${property}Left`]: left !== undefined ? gridCalc(left) : undefined,
  };
}

export function GridCell({
  className,
  children,
  width = 2,
  height = 2,
  padding,
  margin,
  x = 0,
  y = 0,
  animate,
  initial,
  transition,
  style,
  ...props
}: {
  className?: string;
  children: ReactNode;
  width?: number;
  height?: number;
  padding?: SpacingValue;
  margin?: SpacingValue;
  x?: number;
  y?: number;
  animate?: TargetAndTransition;
  initial?: TargetAndTransition;
} & Omit<ComponentPropsWithoutRef<typeof motion.div>, "animate" | "initial">) {
  const showAnimate = x || y || animate;
  const showInitial = x || y || initial;
  return (
    <motion.div
      className={cn(
        "grid-cell flex items-center justify-center",
        (x || y) && "absolute",
        className,
      )}
      style={{
        width: gridCalc(width),
        height: gridCalc(height),
        ...getSpacingStyles(padding, "padding"),
        ...getSpacingStyles(margin, "margin"),
        ...style,
      }}
      initial={
        showInitial
          ? {
              x: x ? `calc(var(--grid-size) * ${x})` : undefined,
              y: y ? `calc(var(--grid-size) * ${y})` : undefined,
              ...initial,
            }
          : undefined
      }
      animate={
        showAnimate
          ? {
              x: x ? `calc(var(--grid-size) * ${x})` : undefined,
              y: y ? `calc(var(--grid-size) * ${y})` : undefined,
              ...animate,
            }
          : undefined
      }
      transition={{
        ...transitions.swift,
        ...transition,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
