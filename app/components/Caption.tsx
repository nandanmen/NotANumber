import type { ComponentPropsWithoutRef } from "react";
import { cn } from "~/lib/cn";

export const Caption = ({
  className,
  ...props
}: ComponentPropsWithoutRef<"figcaption">) => (
  <figcaption
    className={cn("mt-2 text-[0.875rem] text-gray11", className)}
    {...props}
  />
);
