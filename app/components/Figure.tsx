import type { ComponentPropsWithoutRef } from "react";
import { cn } from "~/lib/cn";

export const Figure = (props: ComponentPropsWithoutRef<"figure">) => (
  <figure {...props} />
);

export const Caption = ({
  className,
  ...props
}: ComponentPropsWithoutRef<"p">) => (
  <p
    className={cn("mt-4 px-8 text-center text-[0.875rem]", className)}
    {...props}
  />
);
