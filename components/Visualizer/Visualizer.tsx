"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
} from "react";
import { FaPlay, FaUndo } from "react-icons/fa";
import { cn } from "~/lib/cn";
import { GridBackground, type GridBackgroundProps } from "../Grid";

type VisualizerProps = React.ComponentPropsWithoutRef<"div"> & {
  childBorders?: boolean;
};

export const Visualizer = forwardRef<HTMLDivElement, VisualizerProps>(
  function Visualizer({ className, childBorders = true, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "overflow-hidden rounded-md border border-gray8",
          childBorders
            ? "[&>*:not(:first-child)]:border-t [&>*:not(:first-child)]:border-gray8"
            : "[&>*:not(:first-child)]:border-t-0",
          className,
        )}
        {...props}
      />
    );
  },
);

export const Controls = forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(function Controls({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn("relative flex justify-between bg-gray5 p-2", className)}
      {...props}
    />
  );
});

const paddingClass = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
} as const;

export type ContentProps = GridBackgroundProps & {
  padding?: keyof typeof paddingClass;
};

export const Content = forwardRef<HTMLDivElement, ContentProps>(
  function Content({ className, padding, ...props }, ref) {
    return (
      <GridBackground
        ref={ref}
        className={cn(
          "rounded-none border-0",
          padding && paddingClass[padding],
          className,
        )}
        {...props}
      />
    );
  },
);

export type ToggleButtonProps = HTMLMotionProps<"button"> & {
  secondary?: boolean;
};

export const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  function ToggleButton({ className, secondary, ...props }, ref) {
    return (
      <motion.button
        ref={ref}
        type="button"
        className={cn(
          "cursor-pointer rounded border border-gray8 bg-gray1 px-2 py-1 text-sm",
          "hover:border-gray12",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gray8",
          "disabled:border-gray7 disabled:bg-gray5 disabled:text-gray11 disabled:cursor-not-allowed",
          secondary &&
            "border-0 bg-transparent hover:bg-gray7 disabled:pointer-events-none disabled:text-gray8",
          className,
        )}
        {...props}
      />
    );
  },
);

export const IconButton = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof ToggleButton>
>(function IconButton({ className, secondary: _s, ...props }, ref) {
  return (
    <ToggleButton
      ref={ref}
      {...props}
      secondary
      className={cn(
        "flex h-[22px] items-center justify-center text-gray10",
        className,
      )}
    />
  );
});

export const PlayButton = (
  props: ComponentPropsWithoutRef<typeof IconButton>,
) => {
  return (
    <IconButton {...props}>
      <FaPlay />
    </IconButton>
  );
};

export const UndoButton = (
  props: ComponentPropsWithoutRef<typeof IconButton>,
) => {
  return (
    <IconButton {...props}>
      <FaUndo />
    </IconButton>
  );
};
