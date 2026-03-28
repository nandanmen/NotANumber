"use client";

import { type HTMLMotionProps, motion } from "framer-motion";
import * as React from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

import { IconButton } from "~/components/Visualizer";
import { cn } from "~/lib/cn";

export type TooltipProps = HTMLMotionProps<"div"> & {
  align?: "left" | "right";
};

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  function Tooltip({ align = "left", className, ...props }, ref) {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative rounded-md border border-gray9 bg-gray2 p-4 font-mono shadow-sm",
          "after:absolute after:aspect-square after:w-2.5 after:rotate-45 after:border after:border-inherit after:bg-inherit after:content-[''] after:top-[calc(50%-5px)]",
          align === "left" &&
            "after:-right-1.5 after:border-b-0 after:border-l-0",
          align === "right" &&
            "after:-left-1.5 after:border-t-0 after:border-r-0",
          className,
        )}
        {...props}
      />
    );
  },
);

export function ContentWrapper({
  toggled,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { toggled?: boolean }) {
  return (
    <div
      className={cn(
        "relative flex items-center gap-4 p-8 md:p-12",
        toggled && "justify-end",
        className,
      )}
      {...props}
    />
  );
}

export type LineProps = HTMLMotionProps<"div"> & { active?: boolean };

export const XLine = React.forwardRef<HTMLDivElement, LineProps>(function XLine(
  { active, className, ...props },
  ref,
) {
  return (
    <motion.div
      ref={ref}
      className={cn(
        "absolute left-0 top-1/2 w-full border-b border-dashed border-gray10",
        active && "border-blue10",
        className,
      )}
      {...props}
    />
  );
});

export type YLineProps = LineProps & {
  align?: "left" | "right";
};

export const YLine = React.forwardRef<HTMLDivElement, YLineProps>(
  function YLine({ active, align, className, ...props }, ref) {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "absolute top-0 h-full border-l border-dashed border-gray10",
          active && "border-blue10",
          align === "left" && "translate-x-[60px]",
          align === "right" && "-translate-x-[60px]",
          !align && "-translate-x-[60px]",
          className,
        )}
        {...props}
      />
    );
  },
);

export type SquareProps = HTMLMotionProps<"button"> & {
  active?: boolean;
  outline?: boolean;
  toggled?: boolean;
};

export const Square = React.forwardRef<HTMLButtonElement, SquareProps>(
  function Square({ active, outline, toggled, className, ...props }, ref) {
    return (
      <motion.button
        ref={ref}
        type="button"
        className={cn(
          "relative aspect-square w-[120px] rounded-md border border-blue8 bg-blue6 text-center text-blue11 shadow-sm",
          "hover:border-blue10",
          active && "border-blue10",
          outline && "pointer-events-none absolute bg-gray5 border-gray8",
          toggled && "aspect-auto w-full max-w-none",
          className,
        )}
        {...props}
      />
    );
  },
);

export function PositionText({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"p">) {
  return <p className={cn("font-mono text-gray11", className)} {...props} />;
}

export function Controls({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("mb-3 flex items-center justify-between", className)}
      {...props}
    />
  );
}

export function AlignmentText({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"p">) {
  return <p className={cn("font-mono text-sm", className)} {...props} />;
}

// --

type CounterProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
};

export const Counter = ({
  value,
  onChange,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  step = 1,
}: CounterProps) => {
  return (
    <div className="flex items-center gap-2">
      <IconButton
        secondary
        label="Decrease"
        onClick={() => onChange(Math.max(min, value - step))}
      >
        <FaMinus />
      </IconButton>
      <div className="font-mono text-gray11">{value}px</div>
      <IconButton
        secondary
        label="Increase"
        onClick={() => onChange(Math.min(max, value + step))}
      >
        <FaPlus />
      </IconButton>
    </div>
  );
};
