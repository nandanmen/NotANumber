"use client";

import { cn } from "~/lib/cn";

type ToolbarProps = {
  /**
   * Indicates which button to highlight. When state === editing, assume mode is inspect.
   */
  activeTool: "add" | "inspect" | null;
  onClick: (tool: "add" | "inspect") => void;
};

export function Toolbar({ activeTool, onClick }: ToolbarProps) {
  return (
    <div
      data-prototyper
      className="fixed bottom-6 right-6 z-[99999] flex select-none items-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-700 px-3 py-2 shadow-2xl"
    >
      <button
        type="button"
        onClick={() => onClick("inspect")}
        className={cn(
          "flex items-center gap-1.5 rounded-lg border px-3.5 py-1.5 text-[13px] font-medium transition-colors",
          activeTool === "inspect"
            ? "border-blue-600 bg-blue-600 text-white"
            : "border-neutral-200 dark:border-neutral-700 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800",
        )}
        title="Toggle inspect mode (I)"
      >
        Inspect
      </button>
    </div>
  );
}
