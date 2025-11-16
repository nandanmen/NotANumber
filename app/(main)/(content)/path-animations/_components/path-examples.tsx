"use client";

import { animate, motion, useMotionValue } from "motion/react";
import { type ElementRef, useEffect, useRef } from "react";
import { Wide } from "~/components/mdx/Wide";
import { Figure } from "./figure";
import { LightAnimation } from "./gradient-animation";

export function PathBuckets() {
  const ref = useRef<ElementRef<"g">>(null);
  const offsetDistance = useMotionValue("0%");

  useEffect(() => {
    animate(offsetDistance, "100%", {
      duration: 2,
      repeat: Number.POSITIVE_INFINITY,
      repeatDelay: 1,
    });
  }, [offsetDistance]);

  useEffect(() => {
    offsetDistance.on("change", (v) => {
      if (ref.current) {
        ref.current.style.offsetDistance = v;
      }
    });
  }, [offsetDistance]);

  return (
    <Figure variant="grid">
      <div className="grid grid-cols-3 divide-x divide-borderStrong relative">
        <div>
          <p className="bg-gray2 font-medium py-1 text-center border-b border-gray3">
            1. Drawing
          </p>
          <div className="p-8">
            <svg width="100%" viewBox="0 0 24 24" aria-hidden="true">
              <circle
                cx="12"
                cy="12"
                r="7.25"
                className="fill-gray1 stroke-borderStrong"
                vectorEffect="non-scaling-stroke"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                width="16"
                x="4"
                aria-hidden="true"
              >
                <motion.path
                  d="M7 13L10 16L17 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  animate={{ pathLength: 1 }}
                  initial={{ pathLength: 0 }}
                  transition={{
                    type: "spring",
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: 1,
                  }}
                  strokeLinejoin="round"
                />
              </svg>
            </svg>
          </div>
        </div>
        <div>
          <p className="bg-gray2 font-medium py-1 text-center border-b border-gray3">
            2. Moving
          </p>
          {/* <svg
            width="100%"
            viewBox="0 0 200 200"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              d="M 20 100 C 100 20 100 180 180 100"
              strokeWidth="3"
              strokeDasharray="8"
              className="stroke-gray10"
            />
            <g
              ref={ref}
              style={{
                offsetPath: `path("M 20 100 C 100 20 100 180 180 100")`,
                offsetAnchor: "12px 12px",
              }}
            >
              <path
                className="fill-gray1"
                d="M12 4.75L5.75 19.25L12 15.75L18.25 19.25L12 4.75Z"
                transform="rotate(90 12 12)"
              />
            </g>
          </svg> */}
          <LightAnimation />
        </div>
        <div>
          <p className="bg-gray2 font-medium py-1 text-center border-b border-gray3">
            3. Morphing
          </p>
          <div className="p-8">
            <svg
              width="100%"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="7.25" className="fill-gray1" />
              <path d="M12 4.75A 3.25 7.25 0 0 1 12 19.25">
                <animate
                  attributeName="d"
                  dur="3s"
                  repeatCount="indefinite"
                  values="
                  M12 4.75A 3.25 7.25 0 0 1 12 19.25;
                  M12 4.75A 7.25 7.25 0 0 1 12 19.25;
                  M12 4.75A 7.25 7.25 0 1 0 12 19.25;
                  M12 4.75A 0 7.25 0 1 0 12 19.25;
                  M12 4.75A 0 7.25 0 0 1 12 19.25;
                  M12 4.75A 3.25 7.25 0 0 1 12 19.25;
                "
                  keyTimes="0; 0.24; 0.25; 0.74; 0.75; 1"
                />
              </path>
              <path d="M12 4.75A 3.25 7.25 0 1 0 12 19.25">
                <animate
                  attributeName="d"
                  dur="3s"
                  repeatCount="indefinite"
                  values="
                  M12 4.75A 3.25 7.25 0 1 0 12 19.25;
                  M12 4.75A 0 7.25 0 1 0 12 19.25;
                  M12 4.75A 0 7.25 0 0 1 12 19.25;
                  M12 4.75A 7.25 7.25 0 0 1 12 19.25;
                  M12 4.75A 7.25 7.25 0 1 0 12 19.25;
                  M12 4.75A 3.25 7.25 0 1 0 12 19.25;
                "
                  keyTimes="0; 0.24; 0.25; 0.74; 0.75; 1"
                />
              </path>
              <path d="M5 12H12H19" />
            </svg>
          </div>
        </div>
      </div>
    </Figure>
  );
}
