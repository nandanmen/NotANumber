"use client";

import { animate, motion, useMotionValue } from "motion/react";
import { type ElementRef, useEffect, useRef } from "react";
import { Wide } from "~/components/mdx/Wide";
import { Figure } from "./figure";
import { LightAnimation } from "./gradient-animation";
import { BackgroundGrid } from "~/components/stripe-pattern";
import { Threads } from "./threads";

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
    <Figure variant="inset">
      <div className="grid grid-cols-3 divide-x divide-borderStrong relative">
        <div className="p-8">
          <LightAnimation />
        </div>
        <div className="flex items-center justify-center relative">
          <BackgroundGrid />
          <svg
            width="200"
            viewBox="-1 0 383 201"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            stroke="currentColor"
            strokeWidth="16"
            strokeLinecap="round"
            role="img"
            aria-label="ola"
            className="-translate-y-2"
          >
            <motion.path d="M54.8392 94.4021C30.0177 96.4087 11.449 117.446 7.9409 146.263C4.71509 172.566 19.3553 192.417 42.6804 192.417C70.9682 192.417 89.3305 168.099 90.5712 137.826C91.5637 108.794 77.6679 94.154 58.8094 94.154C43.921 94.154 35.9806 105.32 36.4769 118.968C36.9616 137.628 50.9554 158.58 80.3159 161.257C121.042 164.97 176.741 134.861 199.23 75.6638C205.717 58.5892 208.189 42.4828 208.189 31.2274C208.189 17.8819 203.971 7.63446 192.06 7.63446C180.397 7.63446 172.705 16.6903 165.757 30.9891C157.617 47.5729 151.595 71.4924 149.132 98.5311C142.928 166.377 156.824 191.424 186.552 191.424C216.679 191.424 236.601 165.311 245.216 135.108" />
            <path d="M323.475 112.906C318.61 101.712 308.27 94.1539 291.811 94.1539C264.515 94.1539 244.002 121.449 242.655 150.73C241.481 177.529 253.847 192.593 271.461 192.417C296.461 192.167 314.838 167.611 323.041 115.654C324.053 109.243 325.102 102.549 326.114 96.139" />
            <path d="M326.114 96.1392C325.09 102.642 324.065 109.144 323.04 115.647C318.559 144.086 316.491 155.307 316.713 162.64C317.232 179.762 323.389 191.425 338.774 191.425C358.129 191.425 368.984 178.273 374.195 163.881" />
            <path d="M330.769 19.216C319.355 32.1193 307.692 44.0299 295.285 55.4443" />
          </svg>
        </div>
        {/* <div className="flex items-center justify-center relative">
          <Threads />
        </div> */}
        <div className="flex flex-col items-center justify-center">
          <div className="bg-gray1 rounded-xl flex items-center text-xl font-medium ring-1 ring-black/10 py-2 pl-4 pr-3 gap-2 shadow-md">
            <span>Download</span>
            <svg
              width="24"
              aria-hidden="true"
              viewBox="-2 -2 28 28"
              fill="none"
            >
              <g
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              >
                <path d="M12 14.5 V4 M12 14.5L8.5 11 M12 14.5 L15.5 11">
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    to="0,5"
                    dur="0.1s"
                    fill="freeze"
                  />
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    to="0,0"
                    dur="0.1s"
                    fill="freeze"
                  />
                </path>
                <path d="M20 15 V20 C18 20 6 20 4 20 V15">
                  <animate
                    attributeName="d"
                    to="M20 15 V20 C18 25 6 25 4 20 V15"
                    dur="0.1s"
                    fill="freeze"
                  />
                  <animate
                    attributeName="d"
                    to="M20 15 V20 C18 20 6 20 4 20 V15"
                    dur="0.1s"
                    fill="freeze"
                  />
                </path>
              </g>
            </svg>
          </div>
          <p className="text-gray10 absolute translate-y-10 text-sm">
            Hover me!
          </p>
        </div>
      </div>
    </Figure>
  );
}
