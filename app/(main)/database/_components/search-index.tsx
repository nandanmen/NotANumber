"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ToggleButton } from "./toggle-button";
import { CommandList } from "./mutable-database";

export function SearchIndex() {
  const [state, setState] = useState<"idle" | "second">("idle");
  const [commands, setCommands] = useState([]);
  return (
    <>
      <div className="flex">
        <ToggleButton onClick={() => setState("idle")}>Idle</ToggleButton>
        <ToggleButton onClick={() => setState("second")}>Second</ToggleButton>
        <ToggleButton
          onClick={() => {
            setCommands([...commands, { type: "get", key: 10 }]);
          }}
        >
          Search
        </ToggleButton>
      </div>
      <div className="grid grid-cols-[1fr_3fr] h-[300px] border border-borderStrong rounded-lg overflow-hidden">
        <CommandList
          className="ring-0 shadow-none rounded-none border-r border-borderStrong h-full"
          commands={commands}
          showAll
        />
        {/* <div className="bg-gray3 shadow border-r border-neutral-950/15 px-5 py-4 relative font-mono text-sm">
          $ db get 10
        </div> */}
        <div className="bg-gray5 shadow-inner pr-4 pl-[19px] -ml-[5px] flex items-center overflow-hidden">
          <div className="grid grid-cols-[1fr_2fr] gap-4 w-fit mx-auto">
            <div className="relative">
              <motion.div
                className="absolute inset-0 origin-top"
                animate={{
                  scale: state === "idle" ? 0.9 : 1,
                  y: state === "idle" ? -10 : 0,
                }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              >
                <div className="grid font-mono text-sm gap-2 bg-gray3 rounded-md px-5 py-4 ring-1 ring-neutral-950/15 shadow origin-top h-[164px]">
                  <span>001: 0</span>
                  <span>018: 15</span>
                  <span>007: 29</span>
                  <span>010: 44</span>
                  <span>020: 58</span>
                </div>
              </motion.div>
              <motion.div
                className="relative"
                animate={{
                  y: state === "second" ? 220 : 0,
                }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              >
                <div className="grid font-mono text-sm gap-2 bg-gray3 rounded-md px-5 py-4 ring-1 ring-neutral-950/15 shadow origin-top h-[164px] auto-rows-min">
                  <span>004: 0</span>
                  <span>006: 17</span>
                  <span>012: 35</span>
                </div>
              </motion.div>
            </div>
            <div className="relative">
              <motion.div
                className="absolute inset-0 origin-top"
                animate={{
                  scale: state === "idle" ? 0.95 : 1,
                  y: state === "idle" ? -10 : 0,
                }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              >
                <div className="grid font-mono text-sm gap-2 bg-gray3 rounded-md px-5 py-4 ring-1 ring-neutral-950/15 shadow origin-top h-[164px]">
                  <span>001: Lorem ipsum</span>
                  <span>018: dolor sit</span>
                  <span>007: adipiscing elit.</span>
                  <span>010: consectetur elit.</span>
                  <span>020: Vestibulum varius</span>
                </div>
              </motion.div>
              <motion.div
                className="relative"
                animate={{
                  y: state === "second" ? 220 : 0,
                }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              >
                <div className="grid font-mono text-sm gap-2 bg-gray3 rounded-md px-5 py-4 ring-1 ring-neutral-950/15 shadow origin-top h-[164px] auto-rows-min">
                  <span>004: dolor sit amet</span>
                  <span>006: adipiscing elit.</span>
                  <span>012: consectetur elit.</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
