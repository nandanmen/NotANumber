import type { ReactNode } from "react";
import { Wide } from "~/components/mdx/Wide";
import { BackgroundGrid } from "~/components/stripe-pattern";
import { cn } from "~/lib/cn";

export function Figure({
  variant = "default",
  controls,
  className,
  children,
}: {
  variant?: "default" | "inset" | "grid";
  controls?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <>
      {controls && <div className="flex gap-2 -mb-2">{controls}</div>}
      <Wide
        className={cn(
          "relative border-y md:border-x border-borderStrong md:rounded-lg",
          variant === "inset" && "bg-gray5 shadow-inner",
          variant === "grid" && "overflow-hidden",
          className
        )}
      >
        {variant === "grid" && <BackgroundGrid />}
        {children}
      </Wide>
    </>
  );
}
