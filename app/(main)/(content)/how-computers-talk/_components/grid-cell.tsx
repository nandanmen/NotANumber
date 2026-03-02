import type { CSSProperties, ReactNode } from "react";
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
}: {
  className?: string;
  children: ReactNode;
  width?: number;
  height?: number;
  padding?: SpacingValue;
  margin?: SpacingValue;
}) {
  return (
    <div
      className={cn("flex items-center justify-center", className)}
      style={{
        width: gridCalc(width),
        height: gridCalc(height),
        ...getSpacingStyles(padding, "padding"),
        ...getSpacingStyles(margin, "margin"),
      }}
    >
      {children}
    </div>
  );
}
