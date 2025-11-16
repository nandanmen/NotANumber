import { useMotionValue } from "motion/react";
import { useEffect, useId, useRef } from "react";

export function LightAnimation({ mask = true }: { mask?: boolean }) {
  const id = useId();
  const ref = useRef<SVGCircleElement>(null);
  const offsetDistance = useMotionValue("0%");

  useEffect(() => {
    return offsetDistance.on("change", (v) => {
      if (!ref.current) return;
      ref.current.style.setProperty("offset-distance", v);
    });
  }, [offsetDistance]);

  return (
    <div>
      <svg viewBox="-5 -5 110 110" width="450" aria-hidden="true">
        <defs>
          <radialGradient id={`${id}gradient`} fx="0.9">
            <stop offset="0%" stopColor="white" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <mask id={`${id}mask`} maskUnits="userSpaceOnUse">
            <path
              d="M75 25 v21 a4 4 0 0 1 -4 4 H29 a4 4 0 0 0 -4 4 V75"
              fill="none"
              stroke="currentColor"
            />
          </mask>
        </defs>
        <g className="fill-gray4 stroke-gray5">
          <rect x="50" width="50" height="25" rx="3" />
          <rect y="75" width="50" height="25" rx="3" />
        </g>
        <path
          d="M75 25 v21 a4 4 0 0 1 -4 4 H29 a4 4 0 0 0 -4 4 V75"
          fill="none"
          className="stroke-gray4"
        />
        <g mask={mask ? `url(#${id}mask)` : undefined}>
          <circle
            ref={ref}
            style={{
              offsetPath: `path('M75 22 V46 a4 4 0 0 1 -4 4 H29 a4 4 0 0 0 -4 4 V91')`,
              offsetAnchor: "4px 0px",
            }}
            r="10"
            fill={`url(#${id}gradient)`}
          />
        </g>
        <circle cx="25" cy="75" r="2" fill="currentColor" />
        <circle cx="75" cy="25" r="2" fill="currentColor" />
      </svg>
      {/* <div className="absolute right-4 bottom-4">
        <Button
          id={id}
          onClick={() => {
            animate(offsetDistance, ["0%", "110%"], {
              type: "tween",
              ease: "easeInOut",
              duration: 1.5,
            });
          }}
        >
          Play
        </Button>
      </div> */}
    </div>
  );
}
