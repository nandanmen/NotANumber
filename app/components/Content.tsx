import type { ComponentPropsWithoutRef } from "react";
import { cn } from "~/lib/cn";

/** Prose wrapper; the styles live in the `.content` rule in app.css. */
export const Content = ({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) => (
  <div className={cn("content", className)} {...props} />
);
