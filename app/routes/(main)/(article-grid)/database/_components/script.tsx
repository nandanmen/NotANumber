"use client";

import { motion } from "motion/react";
import { Fragment, type ReactNode, useState } from "react";
import { Wide } from "~/components/mdx/Wide";
import { Figure } from "~/components/mdx/figure";
import { Button } from "~/components/Button";

export function Script({
  mode = "in-memory",
  children,
}: { mode?: "in-memory" | "on-disk"; children: ReactNode }) {
  const [runs, setRuns] = useState(0);
  const [hovering, setHovering] = useState(false);
  return (
    <Figure>
      <div className="w-fit">
        <Button
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
        </Button>
      </div>
      <Wide className="bg-gray4 rounded-lg mx-0 w-full">
        <div className="text-xs text-gray11 font-mono py-1 px-4 border border-[hsl(0_0%_79.8%)] rounded-t-lg border-b-0 -mx-px -mb-1.5 pb-2.5">
          script.js
        </div>
        <div className="grid grid-rows-2 grid-cols-1 md:grid-cols-2 md:grid-rows-1 bg-gray3 rounded-lg ring-1 ring-neutral-950/15 overflow-hidden [&>:first-child]:rounded-none [&>:first-child]:shadow-none [&>:first-child]:ring-0 divide-y md:divide-y-0 md:divide-x divide-neutral-950/15 shadow">
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
      </Wide>
    </Figure>
  );
}
