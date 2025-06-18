"use client";

import { Slider } from "app/svg-paths/components/slider";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";

export function Icon() {
  const progress = useMotionValue(0);
  const useTransformer = (range: [number, number]) => {
    return useTransform(progress, [0, 1], range);
  };
  return (
    <>
      <figure>
        <svg viewBox="0 0 24 24">
          <defs>
            <pattern
              id="grid"
              patternUnits="userSpaceOnUse"
              width="1"
              height="1"
            >
              <g className="stroke-gray7" strokeWidth="0.2">
                <line x1="1" y1="0" x2="1" y2="1" />
                <line x1="0" y1="1" x2="1" y2="1" />
              </g>
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="url(#grid)"
            className="stroke-gray12"
            strokeWidth="0.3"
          />
          <g>
            <g className="stroke-current" strokeLinecap="round">
              <motion.line
                x1={useTransformer([18, 5])}
                y1={useTransformer([18, 12])}
                x2={useTransformer([12, 19])}
                y2="12"
              />
              <motion.line
                x1={useTransformer([11, 12])}
                y1={useTransformer([11, 5])}
                x2={useTransformer([19, 12])}
                y2="19"
              />
            </g>
            <motion.circle
              r={useTransformer([6, 0])}
              cx={useTransformer([11, 12])}
              cy={useTransformer([11, 5])}
              className="fill-gray4 stroke-current"
            />
          </g>
        </svg>
      </figure>
      <form className="flex items-center gap-4">
        <button
          className="py-2 px-4 bg-gray12 text-gray1 rounded-md font-semibold"
          type="button"
          onClick={() =>
            animate(progress, progress.get() === 0 ? 1 : 0, {
              type: "spring",
              duration: 1,
            })
          }
        >
          Play
        </button>
        <Slider
          min={0}
          max={1}
          step={0.1}
          onValueChange={([v]) => progress.set(v)}
        />
      </form>
    </>
  );
}
