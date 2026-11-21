import type { ComponentPropsWithoutRef } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "~/lib/cn";

export const Slider = ({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof SliderPrimitive.Root>) => {
  return (
    <SliderPrimitive.Root
      className={cn("relative flex w-full items-center", className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1 grow rounded-[4px] bg-gray7 dark:bg-gray4">
        <SliderPrimitive.Range className="absolute h-full bg-gray8" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-6 w-4 scale-100 cursor-pointer rounded-[4px] border border-gray8 bg-gray3 shadow-soft transition-transform duration-100 ease-out hover:scale-90 hover:border-blue11 hover:bg-blue9 hover:text-gray1" />
    </SliderPrimitive.Root>
  );
};
