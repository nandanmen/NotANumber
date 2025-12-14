import {
  motion,
  useTransform,
  type MotionValue,
  useMotionValueEvent,
} from "motion/react";
import { PathParts } from "./path-parts";
import { CodeBlockTemplate } from "~/components/mdx/code-block-template";
import { type ReactNode, useMemo, useState } from "react";
import { cn } from "~/lib/cn";
import { Figure } from "./figure";
import { ToggleButton } from "../../database/_components/toggle-button";

const CHECK_STROKE = "M7 13L10 16L17 8";
const CHECK_FILL =
  "M17.6585 7.24744C18.0741 7.61112 18.1163 8.24288 17.7526 8.65852L10.7526 16.6585C10.5703 16.8668 10.3099 16.9902 10.0333 16.9995C9.75666 17.0087 9.4886 16.9028 9.29289 16.7071L6.29289 13.7071C5.90237 13.3166 5.90237 12.6834 6.29289 12.2929C6.68342 11.9024 7.31658 11.9024 7.70711 12.2929L9.95129 14.5371L16.2474 7.34151C16.6111 6.92587 17.2429 6.88375 17.6585 7.24744Z";

export function CheckAnimationWrapper({
  children,
  className,
  onPlay,
}: {
  children: React.ReactNode;
  className?: string;
  onPlay: () => Promise<void>;
}) {
  const [playing, setPlaying] = useState(false);
  return (
    <Figure
      className="overflow-hidden"
      variant="grid"
      controls={
        <ToggleButton
          onClick={async () => {
            setPlaying(true);
            await onPlay();
            setPlaying(false);
          }}
          loading={playing}
        >
          Play
        </ToggleButton>
      }
    >
      <div
        className={cn(
          "grid h-full grid-cols-2 divide-x divide-borderStrong",
          className,
        )}
      >
        {children}
      </div>
    </Figure>
  );
}

export function CheckAnimation({
  dashLength = 16,
  offset,
  showSkeleton,
  variant = "stroke",
  highlight,
}: {
  dashLength?: number;
  offset: MotionValue<number>;
  showSkeleton?: boolean;
  variant?: "stroke" | "fill";
  highlight?: number;
}) {
  const [playing, setPlaying] = useState(false);
  const d = variant === "stroke" ? CHECK_STROKE : CHECK_FILL;

  useMotionValueEvent(offset, "animationStart", () => setPlaying(true));
  useMotionValueEvent(offset, "animationComplete", () => setPlaying(false));

  const displayOffset = useTransform(offset, (v) => v.toFixed(0));
  const values = useMemo(
    () => ({
      offset: (
        <motion.span
          className={cn(
            "transition-colors",
            playing ? "bg-blue5 text-blue11" : "bg-gray4",
          )}
        >
          {displayOffset}
        </motion.span>
      ),
      dashLength,
      d: variant === "stroke" ? "M7 13L10 16..." : "M17.6 7.2C18 7.6...",
    }),
    [displayOffset, playing, dashLength, variant],
  );

  return (
    <div className="relative flex flex-col divide-y divide-borderStrong">
      <div className="flex justify-center grow">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          aria-hidden="true"
          width="100%"
          className="max-w-[300px]"
        >
          <motion.path
            d={d}
            stroke="currentColor"
            strokeWidth={variant === "stroke" ? 2 : 0}
            fill={variant === "fill" ? "currentColor" : "none"}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={dashLength}
            strokeDashoffset="0"
            style={{ strokeDashoffset: offset }}
          />
          {showSkeleton && <PathParts d={d} />}
        </svg>
      </div>
      <PathCodeBlock highlight={highlight} values={values} />
    </div>
  );
}

export function PathCodeBlock({
  highlight,
  values,
}: {
  highlight?: number;
  values: Record<"offset" | "dashLength" | "d", ReactNode>;
}) {
  return (
    <div className="bg-gray4 p-4 relative">
      {typeof highlight === "number" && (
        <div
          className="absolute h-[21px] left-0 right-0 bg-gray6"
          style={{ top: 16 + 21 * highlight }}
        />
      )}
      <pre className="text-sm w-[220px] mx-auto relative">
        <CodeBlockTemplate tokens={CODE_TOKENS} values={values} />
      </pre>
    </div>
  );
}

export const CODE_TOKENS = [
  [
    {
      content: "<",
      offset: 0,
      color: "#24292E",
      fontStyle: 0,
    },
    {
      content: "path",
      offset: 1,
      color: "#B31D28",
      fontStyle: 1,
    },
  ],
  [
    {
      content: "  ",
      offset: 6,
      color: "#24292E",
      fontStyle: 0,
    },
    {
      content: "d",
      offset: 8,
      color: "#6F42C1",
      fontStyle: 0,
    },
    {
      content: "=",
      offset: 9,
      color: "#24292E",
      fontStyle: 0,
    },
    {
      content: '":d:"',
      offset: 10,
      color: "#032F62",
      fontStyle: 0,
    },
  ],
  [
    {
      content: "  ",
      offset: 27,
      color: "#24292E",
      fontStyle: 0,
    },
    {
      content: "stroke",
      offset: 29,
      color: "#6F42C1",
      fontStyle: 0,
    },
    {
      content: "=",
      offset: 35,
      color: "#24292E",
      fontStyle: 0,
    },
    {
      content: '"currentColor"',
      offset: 36,
      color: "#032F62",
      fontStyle: 0,
    },
  ],
  [
    {
      content: "  ",
      offset: 51,
      color: "#24292E",
      fontStyle: 0,
    },
    {
      content: "stroke-dasharray",
      offset: 53,
      color: "#6F42C1",
      fontStyle: 0,
    },
    {
      content: "=",
      offset: 69,
      color: "#24292E",
      fontStyle: 0,
    },
    {
      content: '":dashLength:"',
      offset: 70,
      color: "#032F62",
      fontStyle: 0,
    },
  ],
  [
    {
      content: "  ",
      offset: 85,
      color: "#24292E",
      fontStyle: 0,
    },
    {
      content: "stroke-dashoffset",
      offset: 87,
      color: "#6F42C1",
      fontStyle: 0,
    },
    {
      content: "=",
      offset: 104,
      color: "#24292E",
      fontStyle: 0,
    },
    {
      content: '":offset:"',
      offset: 105,
      color: "#032F62",
      fontStyle: 0,
    },
  ],
  [
    {
      content: "/>",
      offset: 116,
      color: "#24292E",
      fontStyle: 0,
    },
  ],
];
