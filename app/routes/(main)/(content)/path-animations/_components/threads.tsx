"use client";

import { useState } from "react";
import { animate, motion, useMotionValue } from "framer-motion";

const LOGO =
  "M14 5.90968C14 5.90968 12.8403 1.19575 7.91139 1.00639C2.98244 0.817033 1.42001 4.88117 1.12694 6.92737C0.833871 8.97357 0.881464 13.037 3.12748 15.2537C5.3735 17.4704 8.11821 17.075 9.56208 16.734C11.006 16.3929 12.9214 15.2174 13.2172 12.8483C13.5129 10.4792 12.0864 8.96269 9.47703 8.50011C6.86763 8.03754 5.28195 8.77766 5.07004 10.6679C4.85814 12.5581 8.25931 13.7735 9.65099 11.9232C11.0427 10.0729 10.5208 7.01987 9.91193 6.18724C9.30307 5.3546 7.91139 4.98454 7.04159 5.16957C5.75156 5.444 5.21501 6.37227 5.21501 6.37227";

/* export function ThreadsDash() {
  return (
    <div className="grid grid-cols-2 gap-4 relative my-4">
      <div className="aspect-square flex items-center bg-gray2 justify-center rounded-xl">
        <svg width="96" viewBox="0 0 15 18" fill="none" strokeWidth="1.5">
          <path d={LOGO} className="stroke-current" />
        </svg>
      </div>
      <div className="aspect-square flex items-center bg-gray2 justify-center rounded-xl">
        <svg width="96" viewBox="0 0 15 18" fill="none" strokeWidth="1.5">
          <path d={LOGO} className="stroke-gray6" />
          <path
            d={LOGO}
            className="stroke-current"
            strokeDasharray="8 70"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="absolute w-12 h-12 rounded-full flex items-center justify-center bg-gray3 border border-gray5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <ArrowRight size={28} />
      </div>
    </div>
  );
} */

export function Threads({ corrected = true }: { corrected?: boolean }) {
  const [done, setDone] = useState(false);
  const offset = useMotionValue(0);
  return (
    <>
      <svg
        width="128"
        viewBox="0 0 15 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        strokeWidth="1.5"
      >
        <path d={LOGO} className="stroke-gray8" />
        <motion.path
          d={LOGO}
          strokeDasharray={corrected ? "8 70" : "8 62"}
          strokeLinecap="round"
          strokeDashoffset={offset}
          stroke="currentColor"
        />
      </svg>
      <button
        className="absolute bottom-4 right-4"
        onClick={async () => {
          if (done) {
            offset.set(0);
            setDone(false);
            return;
          }
          animate(offset, -70, {
            duration: 1,
          }).then(() => setDone(true));
        }}
      >
        {done ? "Reset" : "Play"}
      </button>
    </>
  );
}
