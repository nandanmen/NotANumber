import { animate, useMotionValue } from "motion/react";
import { useEffect, useId, useRef } from "react";

export function LightAnimation({ mask = true }: { mask?: boolean }) {
  const id = useId();
  const ref = useRef<SVGCircleElement>(null);
  const offsetDistance = useMotionValue("0%");

  useEffect(() => {
    animate(offsetDistance, ["0%", "110%"], {
      type: "tween",
      ease: "easeInOut",
      duration: 1.5,
      repeat: Number.POSITIVE_INFINITY,
    });
  }, [offsetDistance]);

  useEffect(() => {
    return offsetDistance.on("change", (v) => {
      if (!ref.current) return;
      ref.current.style.setProperty("offset-distance", v);
    });
  }, [offsetDistance]);

  return (
    <svg viewBox="-5 -5 110 110" width="100%" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}gradient`} fx="0.9">
          <stop offset="0%" stopColor="green" />
          <stop offset="100%" stopColor="hsl(0 0% 78%)" />
        </radialGradient>
        <path
          id={`${id}path1`}
          d="M75 25 v21 a4 4 0 0 1 -4 4 H29 a4 4 0 0 0 -4 4 V95"
          fill="none"
        />
        <mask id={`${id}mask`} maskUnits="userSpaceOnUse">
          <use href={`#${id}path1`} stroke="white" />
        </mask>
      </defs>
      <use href={`#${id}path1`} className="stroke-gray8" />
      <g mask={mask ? `url(#${id}mask)` : undefined}>
        <circle
          ref={ref}
          style={{
            offsetPath: `url(#${id}path1)`,
            offsetAnchor: "4px 0px",
          }}
          r="10"
          fill={`url(#${id}gradient)`}
        />
      </g>
      <g className="text-gray1 fill-current stroke-borderStrong">
        <rect
          x="50"
          width="50"
          height="25"
          rx="3"
          vectorEffect="non-scaling-stroke"
          className="drop-shadow-sm"
        />
        <rect
          y="75"
          width="50"
          height="25"
          rx="3"
          vectorEffect="non-scaling-stroke"
          className="drop-shadow-sm"
        />
        <circle cx="25" cy="75" r="2" vectorEffect="non-scaling-stroke" />
        <circle cx="75" cy="25" r="2" vectorEffect="non-scaling-stroke" />
      </g>
    </svg>
  );
}
