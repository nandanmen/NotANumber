"use client";

import { motion } from "framer-motion";
import React from "react";

import { cn } from "~/lib/cn";

export const Ruler = () => {
  const [toggled, setToggled] = React.useState(false);

  React.useEffect(() => {
    const timeout = setTimeout(() => setToggled(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Measurement toggled={toggled}>
      <motion.div
        layout
        transition={{ duration: 0.5 }}
        className="h-2.5 w-0.5 bg-gray9"
      />
      <motion.div
        layout
        transition={{ duration: 0.5 }}
        className="h-2.5 w-0.5 bg-gray9"
      />
      <motion.div
        className="absolute top-1 h-0.5 w-full origin-left bg-gray9"
        animate={{ scaleX: toggled ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        initial={{ scaleX: 0 }}
      />
    </Measurement>
  );
};

export function RulerWrapper({
  full,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { full?: boolean }) {
  return (
    <div
      className={cn(
        "absolute flex w-[120px] flex-col items-center",
        full && "w-[calc(100%-4rem)]",
        className,
      )}
      {...props}
    />
  );
}

export const RulerText = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof motion.p>
>(function RulerText({ className, ...props }, ref) {
  return (
    <motion.p
      ref={ref}
      className={cn("font-mono text-sm text-gray11 opacity-100", className)}
      {...props}
    />
  );
});

function Measurement({
  toggled,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { toggled?: boolean }) {
  return (
    <div
      className={cn(
        "relative flex w-full justify-center",
        toggled && "justify-between",
        className,
      )}
      {...props}
    />
  );
}
