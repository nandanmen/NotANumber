import { useId } from "react";
import { clsx } from "clsx";

function StripePattern({
  size = 8,
  ...props
}: {
  size?: number;
} & React.ComponentPropsWithoutRef<"pattern">) {
  return (
    <defs>
      <pattern
        viewBox="0 0 10 10"
        width={size}
        height={size}
        patternUnits="userSpaceOnUse"
        {...props}
      >
        <line
          x1="0"
          y1="10"
          x2="10"
          y2="0"
          stroke="currentColor"
          vectorEffect="non-scaling-stroke"
        />
      </pattern>
    </defs>
  );
}

function GridPattern({
  size = 16,
  ...props
}: {
  size?: number;
} & React.ComponentPropsWithoutRef<"pattern">) {
  return (
    <defs>
      <pattern
        viewBox="0 0 10 10"
        width={size}
        height={size}
        patternUnits="userSpaceOnUse"
        {...props}
      >
        <path
          d="M0 5H10 M5 0V10"
          stroke="currentColor"
          vectorEffect="non-scaling-stroke"
          fill="none"
        />
      </pattern>
    </defs>
  );
}

export function BackgroundGrid({ className }: { className?: string }) {
  const id = useId();
  return (
    <div className={clsx("absolute inset-0 text-gray6", className)}>
      <svg width="100%" height="100%">
        <GridPattern id={id} />
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    </div>
  );
}

export function BackgroundStripes({
  className,
  patternProps,
}: {
  className?: string;
  patternProps?: React.ComponentPropsWithoutRef<"pattern">;
}) {
  const id = useId();
  return (
    <div className={clsx("absolute inset-0 text-gray6", className)}>
      <svg width="100%" height="100%">
        <StripePattern id={id} {...patternProps} />
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    </div>
  );
}
