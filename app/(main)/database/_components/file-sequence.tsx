"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ToggleButton } from "./toggle-button";
import { cn } from "~/lib/cn";

const NEW_CONTENT_WIDTH = 106;

export function FileSequence({ updateable = false }: { updateable?: boolean }) {
  const [updated, setUpdated] = useState(false);
  const [animating, setAnimating] = useState(false);
  return (
    <>
      {updateable && (
        <div className="w-fit">
          <ToggleButton onClick={() => setUpdated(!updated)}>
            Update
          </ToggleButton>
        </div>
      )}
      <div className="!col-start-1 col-span-3 !max-w-full">
        <div className="p-4 bg-gray5 shadow-inner rounded-lg overflow-hidden border border-borderStrong">
          <p className="whitespace-pre font-mono">
            {updateable ? (
              <span className="text-gray11 flex items-baseline">
                001:Lorem␣ipsum\n018:dolor␣sit\n
                <span className="bg-gray2 py-1.5 text-gray12 -my-1.5 shrink-0 relative">
                  005:adipiscing␣elit.
                  <motion.span
                    className="absolute py-1.5 top-0 bg-gray2 overflow-hidden"
                    animate={{ width: updated ? NEW_CONTENT_WIDTH : 0 }}
                    initial={{ width: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 280,
                      damping: 18,
                      mass: 0.3,
                    }}
                  >
                    <span className="bg-blue4 text-blue11 py-1">
                      ␣vel␣mauris
                    </span>
                  </motion.span>
                </span>
                <motion.span
                  className={cn(
                    "py-1.5 -my-1.5 transition-colors duration-300",
                    animating && "bg-gray3"
                  )}
                  animate={{ x: updated ? NEW_CONTENT_WIDTH : 0 }}
                  onAnimationStart={() => setAnimating(true)}
                  onAnimationComplete={() => setAnimating(false)}
                  transition={{
                    type: "spring",
                    stiffness: 280,
                    damping: 18,
                    mass: 0.3,
                  }}
                >
                  \n014:Vestibulum␣varius\n002:vel␣mauris\n007:consectetur␣adipiscing␣elit.\n010:Vestibulum␣varius\n016:vel␣mauris\n003:consectetur␣adipiscing␣elit.
                </motion.span>
              </span>
            ) : (
              "001:Lorem␣ipsum\\n018:dolor␣sit\\n005:adipiscing␣elit.\\n014:Vestibulum␣varius\\n002:vel␣mauris\\n007:consectetur␣adipiscing␣elit.\\n010:Vestibulum␣varius\\n016:vel␣mauris\\n003:consectetur␣adipiscing␣elit."
            )}
          </p>
        </div>
      </div>
    </>
  );
}
