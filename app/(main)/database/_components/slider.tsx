"use client";

import { type ReactNode, useContext } from "react";
import {
  type SliderProps,
  Slider as SliderRoot,
  SliderThumb,
  SliderTrack,
  SliderStateContext,
} from "react-aria-components";
import { cn } from "~/lib/cn";

export function Slider(props: SliderProps & { children?: ReactNode }) {
  return (
    <SliderRoot className="w-full" {...props}>
      <div className="flex touch-none items-center py-3 select-none px-2.5">
        <SliderTrack className="h-1.5 grow rounded-full bg-gray6 select-none">
          {({ state }) => (
            <>
              <div
                className="absolute h-full rounded bg-gray12"
                style={{ width: `${state.getThumbPercent(0) * 100}%` }}
              />
              {props.children}
              <SliderThumb className="size-5 rounded-full bg-gray2 ring-1 ring-neutral-950/15 shadow select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-800 top-1/2" />
            </>
          )}
        </SliderTrack>
      </div>
    </SliderRoot>
  );
}

export function SliderMarker({
  value,
  children,
}: {
  value: number;
  children?: ReactNode;
}) {
  const context = useContext(SliderStateContext);
  if (!context) return null;
  const offset = value / context.getThumbMaxValue(0);
  const hasPassed = context.getThumbValue(0) > value;
  return (
    <div
      className={cn(
        "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-5 rounded-full flex items-center justify-center",
        hasPassed ? "bg-gray12" : "bg-gray6",
      )}
      style={{ left: `${offset * 100}%` }}
    >
      {hasPassed ? (
        <>{children}</>
      ) : (
        <div className="bg-gray3 size-2.5 rounded-full" />
      )}
    </div>
  );
}
