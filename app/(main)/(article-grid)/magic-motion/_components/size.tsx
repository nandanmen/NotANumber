"use client";

import { motion } from "framer-motion";
import React from "react";

import { cn } from "~/lib/cn";

import { Square } from "./shared";

export const SizeExample = React.forwardRef<
  HTMLButtonElement,
  { toggled: boolean; layout?: boolean }
>(function SizeExample({ toggled, layout = true }, ref) {
  return (
    <>
      {layout && (
        <motion.div
          layout={layout}
          transition={{ duration: 1 }}
          className={cn(
            "absolute h-[122px] w-[122px] bg-blue8",
            "left-[calc(2rem-1px)] md:left-[calc(3rem-1px)]",
            toggled && "w-[calc(100%-6rem+2px)]",
          )}
          style={{ borderRadius: 7 }}
        />
      )}
      <Square
        ref={ref}
        layout={layout}
        transition={{ duration: 1 }}
        toggled={toggled}
        style={{ borderRadius: 6 }}
        className={cn(
          "relative h-[120px] pointer-events-none",
          toggled && "aspect-auto w-full",
          layout && "border-none shadow-none",
        )}
      />
    </>
  );
});
