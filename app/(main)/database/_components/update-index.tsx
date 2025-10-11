"use client";

import { Wide } from "~/components/mdx/Wide";
import { ResetButton, ToggleButton } from "./toggle-button";
import { FileDatabase } from "./file-database";
import { AnimatePresence, motion, useIsPresent } from "motion/react";
import {
  getFileDatabaseControls,
  toFileDatabaseRecords,
} from "./mutable-database";
import { useEffect, useState } from "react";
import { createStore } from "../_lib/file-database";
import { useFileDatabase } from "../_lib/use-file-database";
import { cn } from "~/lib/cn";

export function UpdateIndex() {
  const [store, setStore] = useState(
    createStore([
      { type: "set", key: 1, value: "Lorem ipsum" },
      { type: "set", key: 18, value: "dolor sit" },
    ]),
  );
  const db = useFileDatabase(store, (u) => setStore((s) => ({ ...s, ...u })));
  const controls = getFileDatabaseControls({ store, db });

  const getIndexRecords = () => {
    const index = {};
    let offset = 0;
    for (const record of store.records) {
      if (record.value === "null") {
        delete index[record.key];
        continue;
      }
      index[record.key] = offset;
      offset += record.value.length + record.key.toString().length + 3;
    }
    return Object.entries(index) as [string, number][];
  };

  return (
    <>
      <div className="flex gap-2 -mb-1">
        <ToggleButton onClick={controls.add}>Add</ToggleButton>
        <ToggleButton onClick={controls.update}>Update</ToggleButton>
        <ToggleButton onClick={controls.delete}>Delete</ToggleButton>
        <ResetButton
          onClick={() =>
            setStore(
              createStore([
                { type: "set", key: 1, value: "Lorem ipsum" },
                { type: "set", key: 18, value: "dolor sit" },
              ]),
            )
          }
        />
      </div>
      <Wide>
        <div className="md:h-[300px] overflow-hidden md:rounded-lg border-y md:border-x border-borderStrong shadow-inner bg-gray5 grid grid-rows-[repeat(2,200px)] md:grid-rows-none md:grid-cols-[2fr_1fr]">
          <div className="p-6 pb-0 overflow-hidden">
            <FileDatabase
              className="md:max-w-[300px] mx-auto translate-y-4"
              records={toFileDatabaseRecords(store)}
            />
          </div>
          <div className="p-6 pb-0 border-t md:border-l md:border-t-0 border-borderStrong">
            <ul className="bg-gray2 rounded-lg h-full ring-1 ring-neutral-950/15 text-sm py-4 shadow-md font-mono md:max-w-[200px] mx-auto translate-y-4">
              <AnimatePresence>
                {getIndexRecords().map(([key, offset]) => (
                  <IndexItem keyValue={key} offset={offset} key={key} />
                ))}
              </AnimatePresence>
            </ul>
          </div>
        </div>
      </Wide>
    </>
  );
}

function IndexItem({ keyValue, offset }: { keyValue: string; offset: number }) {
  const [isAnimating, setIsAnimating] = useState(true);
  const isPresent = useIsPresent();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setIsAnimating(true);
    const timeout = setTimeout(() => {
      setIsAnimating(false);
    }, 600);
    return () => clearTimeout(timeout);
  }, [offset]);

  return (
    <motion.li
      layout="position"
      className={cn(
        "px-5 flex items-center overflow-hidden transition-colors duration-300",
        (isAnimating || !isPresent) && "bg-gray4",
      )}
      initial={{ height: 0 }}
      animate={{ height: 28 }}
      exit={{ height: 0 }}
      onAnimationComplete={() => setIsAnimating(false)}
    >
      {String(keyValue).padStart(3, "0")}: {offset}
    </motion.li>
  );
}
