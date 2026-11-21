import type { ComponentPropsWithoutRef } from "react";
import { cn } from "~/lib/cn";

export const SecondaryButton = ({
  className,
  ...props
}: ComponentPropsWithoutRef<"button">) => (
  <button
    type="button"
    className={cn(
      "flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-[4px] border-none bg-transparent text-gray11 shadow-none hover:border-none hover:bg-gray7 hover:text-gray11",
      className,
    )}
    {...props}
  />
);
