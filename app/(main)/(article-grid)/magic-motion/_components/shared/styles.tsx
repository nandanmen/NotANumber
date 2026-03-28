"use client";

import { motion } from "framer-motion";
import React, { type ComponentPropsWithoutRef } from "react";

import { cn } from "~/lib/cn";

export const PADDING = 32;
export const SQUARE_RADIUS = 60;

const primarySquareClass =
  "drop-shadow-sm fill-blue6 stroke-blue8 [vector-effect:non-scaling-stroke]";
const secondarySquareClass =
  "fill-gray6 stroke-gray8 filter-none [vector-effect:non-scaling-stroke]";

export type BaseSvgSquareProps = ComponentPropsWithoutRef<
  typeof motion.rect
> & {
  type?: "secondary";
};

export const BaseSvgSquare = React.forwardRef<
  SVGRectElement,
  BaseSvgSquareProps
>(function BaseSvgSquare({ type, className, ...props }, ref) {
  return (
    <motion.rect
      ref={ref}
      rx="6"
      className={cn(
        type === "secondary" ? secondarySquareClass : primarySquareClass,
        className,
      )}
      {...props}
    />
  );
});

export const SvgSquare = React.forwardRef<SVGRectElement, BaseSvgSquareProps>(
  function SvgSquare({ className, ...props }, ref) {
    return (
      <BaseSvgSquare
        ref={ref}
        className={cn("h-[120px]", className)}
        {...props}
      />
    );
  },
);
