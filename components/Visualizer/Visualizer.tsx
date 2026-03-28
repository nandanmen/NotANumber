"use client";

import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { FaPlay, FaUndo } from "react-icons/fa";
import { cn } from "~/lib/cn";
import {
  Button as ChromeButton,
  IconButton as ChromeIconButton,
} from "../Button";
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
          "overflow-hidden md:rounded-lg border-y md:border-x border-borderStrong",
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
      className={cn(
        "relative flex justify-between bg-gray4 px-[var(--content-padding)] py-3 md:px-3",
        className,
      )}
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

export type ToggleButtonProps = Omit<
  ComponentPropsWithoutRef<typeof ChromeButton>,
  "variant"
> & {
  secondary?: boolean;
};

export const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  function ToggleButton({ className, secondary, ...props }, ref) {
    return (
      <ChromeButton
        ref={ref}
        variant={secondary ? "secondary" : "default"}
        className={className}
        {...props}
      />
    );
  },
);

type VisualizerIconButtonProps = Omit<
  ComponentPropsWithoutRef<typeof ChromeIconButton>,
  "variant"
> & {
  secondary?: boolean;
  label?: string;
};

export const IconButton = forwardRef<
  HTMLButtonElement,
  VisualizerIconButtonProps
>(function IconButton(
  { className, secondary: _secondary, label = "Action", ...props },
  ref,
) {
  return (
    <ChromeIconButton
      ref={ref}
      variant="ghost"
      label={label}
      className={cn(
        "flex h-[22px] items-center justify-center text-gray10",
        className,
      )}
      {...props}
    />
  );
});

export const PlayButton = forwardRef<
  HTMLButtonElement,
  Omit<ComponentPropsWithoutRef<typeof IconButton>, "children" | "label">
>(function PlayButton(props, ref) {
  return (
    <IconButton ref={ref} label="Play" {...props}>
      <FaPlay />
    </IconButton>
  );
});

export const UndoButton = forwardRef<
  HTMLButtonElement,
  Omit<ComponentPropsWithoutRef<typeof IconButton>, "children" | "label">
>(function UndoButton(props, ref) {
  return (
    <IconButton ref={ref} label="Undo" {...props}>
      <FaUndo />
    </IconButton>
  );
});
