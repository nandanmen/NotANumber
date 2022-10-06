import React from "react";
import { GridBackground } from "../Grid";

export const DEFAULT_HEIGHT = 300;

type SvgGridWrapperProps = {
  height?: number;
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<typeof GridBackground>;

export const SvgGridWrapper = React.forwardRef<
  HTMLDivElement,
  SvgGridWrapperProps
>(function SvgGridWrapper(
  { height = DEFAULT_HEIGHT, children, ...props },
  ref
) {
  return (
    <GridBackground css={{ height }} ref={ref} {...props}>
      <svg width="100%" height="100%">
        {children}
      </svg>
    </GridBackground>
  );
});
