"use client";

import { Fragment, type ReactNode, useState } from "react";
import { motion } from "motion/react";
import { ToggleButton } from "./toggle-button";

export function Script({
  mode = "in-memory",
  children,
}: { mode?: "in-memory" | "on-disk"; children: ReactNode }) {
  const [runs, setRuns] = useState(0);
  const [hovering, setHovering] = useState(false);
  return (
    <>
      <div className="w-fit -mb-2">
        <ToggleButton
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onClick={() => {
            if (runs > 1) setRuns(0);
            else {
              setRuns(runs + 1);
              setHovering(false);
            }
          }}
        >
          {runs > 1 ? "Reset" : "Run"}
        </ToggleButton>
      </div>
      <div className="!max-w-[initial] bg-gray4 rounded-lg">
        <div className="text-xs text-gray11 font-mono py-1 px-4 border border-[hsl(0_0%_79.8%)] rounded-t-lg border-b-0 -mx-px -mb-1.5 pb-2.5">
          script.js
        </div>
        <div className="grid grid-cols-2 bg-gray3 rounded-lg ring-1 ring-neutral-950/15 overflow-hidden [&>:first-child]:rounded-r-none [&>:first-child]:shadow-none [&>:first-child]:ring-0 divide-x divide-neutral-950/15 shadow">
          {children}
          <div className="font-mono p-4 text-sm">
            {Array.from({ length: runs }).map((_, i) => {
              return (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                <Fragment key={i}>
                  <span className="flex fit-content">
                    <span className="mr-[1ch] text-gray10">$</span>
                    <span className="block overflow-hidden whitespace-nowrap">
                      node script.js
                    </span>
                  </span>
                  <span className="grid pl-[2ch]">
                    {mode === "in-memory" ? (
                      <>
                        <span>2</span>
                        <span>3</span>
                      </>
                    ) : (
                      <>
                        <span>{3 + i}</span>
                        <span>{4 + i}</span>
                      </>
                    )}
                  </span>
                </Fragment>
              );
            })}
            <span className="flex fit-content">
              <span className="mr-[1ch] text-gray10">$</span>
              <motion.span
                key={runs}
                className="block overflow-hidden whitespace-nowrap"
                animate={{ width: hovering ? 118 : 0 }}
                initial={{ width: 0 }}
              >
                node script.js
              </motion.span>
              <span className="w-2 h-4 block bg-gray10 mt-0.5" />
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
