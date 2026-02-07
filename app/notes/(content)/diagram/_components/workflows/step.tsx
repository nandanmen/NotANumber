import { type HTMLMotionProps, motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "~/lib/cn";
import { DoIcon, EllipsisIcon, SleepIcon, WaitForEventIcon } from "./icons";
import { transitions } from "./transitions";
import type { RuntimeStatus, StepState } from "./types";

export function getStepStatus(state?: StepState): RuntimeStatus {
  // No start time means skipped
  if (!state?.start) return "skipped";

  // Has end time - check success/error
  if (state.end) {
    if (state.success === true || state.finished === true) {
      // Check if there was an error despite being "finished"
      if (state.error) return "failed";
      return "success";
    }
    if (state.success === false || state.error) return "failed";
    return "success";
  }

  // Started but not ended = pending
  return "pending";
}

function formatDuration(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffMs = endDate.getTime() - startDate.getTime();

  if (diffMs < 1000) return `${diffMs}ms`;
  if (diffMs < 60000) return `${(diffMs / 1000).toFixed(1)}s`;

  const minutes = Math.floor(diffMs / 60000);
  const seconds = Math.round((diffMs % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
}

function StepIcon({ type }: { type: "do" | "waitForEvent" | "sleep" }) {
  if (type === "do") return <DoIcon />;
  if (type === "sleep") return <SleepIcon />;
  return <WaitForEventIcon />;
}

export function StepWrapper({
  wrapperClassName,
  className,
  type,
  children,
  variant = "default",
  ...props
}: {
  wrapperClassName?: string;
  type: ReactNode;
  variant?: "default" | "error" | "static" | "skipped";
} & Omit<HTMLMotionProps<"div">, "children"> & { children: ReactNode }) {
  const ringClass =
    variant === "error"
      ? "ring-red-500 shadow-red-500/20"
      : "ring-black/20 dark:ring-neutral-800 shadow-black/7";
  const connectorClass =
    variant === "error"
      ? "border-red-500"
      : "border-black/20 dark:border-neutral-700";
  return (
    <div className={cn("w-fit", wrapperClassName)}>
      <div
        className={cn(
          "w-2.5 h-[5px] rounded-t-xs mx-auto transition-colors duration-200",
          ["skipped", "static"].includes(variant)
            ? "bg-(--color-connector)"
            : "bg-(--color-connector-active)",
        )}
      />
      <motion.div
        className={cn(
          "bg-surface dark:bg-neutral-900 w-fit rounded-lg ring shadow-md text-base relative z-20 min-w-[100px]",
          ringClass,
          variant === "skipped" &&
            "bg-neutral-50 dark:bg-neutral-950 text-muted dark:text-neutral-600 shadow-none ring-black/15",
          className,
        )}
        {...props}
      >
        <header
          className={cn(
            "text-muted py-1 px-2 flex justify-between bg-neutral-50 dark:bg-neutral-950 border-b rounded-t-lg border-color dark:text-neutral-400",
            variant === "skipped" && "bg-neutral-100 dark:text-neutral-600",
          )}
        >
          <p className="font-mono text-xs">{type}</p>
          <EllipsisIcon />
        </header>
        {children}
      </motion.div>
      <div
        className={cn(
          "size-3 border bg-surface dark:bg-neutral-800 rounded -mt-1.5 relative z-30 mx-auto transition-colors duration-200",
          connectorClass,
        )}
      />
    </div>
  );
}

export function Step({
  node,
  state,
  isStatic,
}: {
  node: {
    type: "do" | "waitForEvent" | "sleep";
    name: string;
  };
  state?: StepState;
  isStatic?: boolean;
}) {
  const status = getStepStatus(state);
  const showStaticState = isStatic || !state || status === "skipped";

  const attempts = state?.attempts ?? [];
  const currentAttempt = attempts.length || 1;

  const duration =
    state?.start && state?.end ? formatDuration(state.start, state.end) : null;

  const isSuccess = status === "success";
  const isFailed = status === "failed";
  const isPending = status === "pending";

  const variant = () => {
    if (showStaticState) return isStatic ? "static" : "skipped";
    return status === "failed" ? "error" : "default";
  };

  return (
    <StepWrapper
      animate={{ height: showStaticState ? 61 : 86 }}
      className="overflow-hidden"
      type={node.type}
      transition={transitions.swift}
      variant={variant()}
    >
      <div
        className={cn(
          "pr-2.5 pl-2 py-2 flex",
          !showStaticState &&
            "border-0 border-b border-dashed border-color dark:border-neutral-700",
          isPending ? "gap-1.5" : "gap-1",
          isFailed && "text-error",
        )}
      >
        <span
          className={cn(
            "flex items-center",
            isFailed && "h-lh",
            isSuccess && "text-blue-500",
          )}
        >
          <StepIcon type={node.type} />
        </span>
        <span
          className={cn(
            "font-medium truncate min-w-0",
            isPending && "text-muted",
          )}
        >
          {node.name}
        </span>
      </div>
      {!showStaticState && (
        <footer
          className={cn(
            "text-xs px-2.5 py-1 flex justify-between",
            isFailed && "text-error",
          )}
        >
          <span>#{currentAttempt}</span>
          <span>{duration ?? "--"}</span>
        </footer>
      )}
    </StepWrapper>
  );
}
