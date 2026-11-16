"use client";

import { motion } from "framer-motion";
import * as React from "react";

import { cn } from "~/lib/cn";

export const HorizontalRuler = ({
  from,
  to,
  showLine = true,
  small = false,
}: {
  from: number;
  to: number;
  showLine?: boolean;
  small?: boolean;
}) => {
  const distance = to - from;
  return (
    <g>
      {showLine && <Line x1={from} x2={to} y1="0" y2="0" />}
      <LineEndpoint cx={from} small={small} cy="0" />
      <LineEndpoint cx={to} small={small} cy="0" />
      <g style={{ transform: `translateX(${(to - from) / 2 + from}px)` }}>
        <RulerTextBackground small={small} />
        <RulerTextSvg
          x="0"
          textAnchor="middle"
          dominantBaseline="middle"
          small={small}
        >
          {distance.toFixed(1)}
        </RulerTextSvg>
      </g>
    </g>
  );
};

export const RulerTextBackground = ({
  small = false,
  ...props
}: React.SVGProps<SVGRectElement> & { small?: boolean }) => {
  const smallProps = small
    ? {
        x: -25,
        y: -12.5,
      }
    : {
        x: -30,
        y: -15,
      };
  return (
    <rect
      rx="4"
      className={cn(
        "fill-blue2 stroke-blue8",
        small ? "h-[25px] w-[50px]" : "h-[30px] w-[60px]",
      )}
      {...smallProps}
      {...props}
    />
  );
};

function RulerTextSvg({
  small = false,
  className,
  ...props
}: React.SVGProps<SVGTextElement> & { small?: boolean }) {
  return (
    <text
      className={cn(
        "fill-blue10 font-mono text-sm",
        small && "text-xs",
        className,
      )}
      {...props}
    />
  );
}

export const Line = React.forwardRef<
  SVGLineElement,
  React.ComponentPropsWithoutRef<typeof motion.line>
>(function Line({ className, ...props }, ref) {
  return (
    <motion.line
      ref={ref}
      className={cn("stroke-blue8 [stroke-dasharray:4] stroke-2", className)}
      {...props}
    />
  );
});

export const LineEndpoint = React.forwardRef<
  SVGCircleElement,
  React.ComponentPropsWithoutRef<typeof motion.circle> & { small?: boolean }
>(function LineEndpoint({ small, className, ...props }, ref) {
  return (
    <motion.circle
      ref={ref}
      r={small ? 4 : 6}
      className={cn("fill-blue2 stroke-blue8", className)}
      {...props}
    />
  );
});
