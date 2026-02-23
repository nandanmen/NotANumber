import type { ReactNode } from "react";
import { Server } from "./_components/dns";

export function PageHeader({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[calc(round(70vh,var(--grid-size))+1px)] !col-start-1 col-span-4 grid grid-cols-subgrid border-b border-borderSoft mb-[calc(var(--grid-size)-16px)] relative">
      <section className="col-start-2 auto-rows-min gap-y-5 leading-relaxed grid">
        {children}
      </section>
      <figure className="col-start-4 flex flex-col">
        <GridCell className="border border-blue-500 grow" padding={3}>
          <GridCell className="flex items-center" width={2} height={2}>
            <Server />
          </GridCell>
          <GridCell className="flex items-center" width={2} height={2}>
            <Server />
          </GridCell>
        </GridCell>
      </figure>
    </div>
  );
}

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
): React.CSSProperties {
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
  width,
  height,
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
      className={className}
      style={{
        width: width !== undefined ? gridCalc(width) : undefined,
        height: height !== undefined ? gridCalc(height) : undefined,
        ...getSpacingStyles(padding, "padding"),
        ...getSpacingStyles(margin, "margin"),
      }}
    >
      {children}
    </div>
  );
}
