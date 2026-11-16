"use client";

import { motion } from "framer-motion";
import React from "react";

import { Content, Visualizer } from "~/components/Visualizer";
import { Wide } from "~/components/mdx/Wide";
import { cn } from "~/lib/cn";

export const SizeDistanceInverseSnapshot = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const initialRef = React.useRef<HTMLDivElement>(null);
  const finalRef = React.useRef<HTMLDivElement>(null);

  const [transform, setTransform] = React.useState({
    x: 0,
    y: 0,
    scaleY: 1,
    scaleX: 1,
  });

  React.useEffect(() => {
    const transform = invert({
      from: finalRef.current?.getBoundingClientRect(),
      to: initialRef.current?.getBoundingClientRect(),
    });
    setTransform(transform);
  }, []);

  return (
    <Wide>
      <Visualizer>
        <Content
          ref={containerRef}
          style={{ height: 300 }}
          className="relative flex items-center justify-between p-8"
        >
          <SnapshotSquare ref={initialRef} secondary striped />
          <SnapshotSquare ref={finalRef} large striped />
          <SnapshotSquare
            large
            className="absolute right-8"
            style={{
              transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scaleX}, ${transform.scaleY})`,
            }}
          />
        </Content>
      </Visualizer>
    </Wide>
  );
};

function invert({
  from,
  to,
}: {
  from?: DOMRect;
  to?: DOMRect;
}) {
  if (!from || !to) {
    return { x: 0, y: 0, scaleX: 1, scaleY: 1 };
  }
  const { x: fromX, y: fromY, width: fromWidth, height: fromHeight } = from;
  const { x, y, width, height } = to;

  return {
    x: x - fromX,
    y: y - fromY,
    scaleX: width / fromWidth,
    scaleY: height / fromHeight,
  };
}

const SnapshotSquare = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof motion.div> & {
    large?: boolean;
    secondary?: boolean;
    striped?: boolean;
  }
>(function SnapshotSquare(
  { large, secondary, striped, className, ...props },
  ref,
) {
  return (
    <motion.div
      ref={ref}
      className={cn(
        "aspect-square rounded-md border shadow-sm",
        large ? "w-[200px]" : "w-[120px]",
        secondary
          ? "border-gray7 bg-gray6 shadow-none"
          : "border-blue8 bg-blue6",
        striped &&
          !secondary &&
          "shadow-none bg-[repeating-linear-gradient(-45deg,theme(colors.blue6),theme(colors.blue6)_5px,transparent_5px,transparent_10px)]",
        striped &&
          secondary &&
          "shadow-none bg-[repeating-linear-gradient(-45deg,theme(colors.gray6),theme(colors.gray6)_5px,transparent_5px,transparent_10px)]",
        className,
      )}
      {...props}
    />
  );
});
