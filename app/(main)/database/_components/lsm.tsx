"use client";

import { Wide } from "~/components/mdx/Wide";
import { ResetButton, ToggleButton } from "./toggle-button";
import { FileDatabase } from "./file-database";
import { useState } from "react";
import { motion, stagger, useAnimate } from "motion/react";
import { getNextRecord } from "./mutable-database";
import { cn } from "~/lib/cn";
import { delay, sleep } from "~/lib/utils";

const MEMORY_LIMIT = 3;

export function LSM({ showLog = false }) {
  const [scope, animate] = useAnimate();

  const [log, setLog] = useState<{ key: number; value: string }[]>([
    { key: 10, value: "Lorem ipsum" },
  ]);
  const [memoryRecords, setMemoryRecords] = useState<
    { key: number; value: string }[]
  >([{ key: 10, value: "Lorem ipsum" }]);
  const [diskRecords, setDiskRecords] = useState<
    { key: number; value: string }[][]
  >([[]]);
  const [loading, setLoading] = useState(false);

  const disk = (
    <div className="px-6 pt-3 pb-0 overflow-hidden flex flex-col">
      <p className="text-sm font-medium text-gray11 mb-3 text-center">
        {showLog ? "On-Disk Database" : "On-Disk"}
      </p>
      <div
        className={cn(
          "grow -mt-6 flex items-center relative",
          !showLog && "justify-center",
        )}
      >
        {diskRecords.map((segment, i) => {
          const inverseIndex = diskRecords.length - i - 1;
          return (
            <FileDatabase
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              key={i}
              className="h-[116px] w-[270px] absolute"
              animate={{
                y: inverseIndex * -16,
                scale: 1 - inverseIndex * 0.08,
                backgroundColor: `hsl(0 0% ${97.3 - inverseIndex * 2.5}%)`,
                "--tw-ring-color": `rgb(10 10 10 / ${0.15 - inverseIndex * 0.02})`,
              }}
              initial={{ y: 200 }}
              transition={{ type: "spring", bounce: 0, duration: 0.5 }}
              records={segment.map((record) => ({
                value: { key: record.key, value: record.value },
              }))}
            />
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      <div className="flex gap-2 -mb-2 h-8 items-center">
        <ToggleButton
          loading={loading}
          onClick={async () => {
            const nextRecord = getNextRecord(memoryRecords);

            if (memoryRecords.length < MEMORY_LIMIT) {
              setMemoryRecords((m) => [...m, nextRecord]);
              setLog((l) => [...l, nextRecord]);
              return;
            }

            const isLatestEmpty = diskRecords.at(-1)?.length === 0;
            if (!isLatestEmpty) {
              setDiskRecords((d) => [...d, []]);
            }

            setLoading(true);
            animate(
              ".memory",
              { y: 250 },
              {
                type: "spring",
                damping: 20,
                delay: stagger(0.1, { from: "last" }),
              },
            );
            await sleep(700);

            const staggeredWrites = memoryRecords.map((record, index) =>
              delay(index * 100, () => {
                setDiskRecords((d) => {
                  const latest = d.at(-1);
                  const rest = d.slice(0, -1);
                  return [...rest, [...latest, record]];
                });
              }),
            );

            await Promise.all(staggeredWrites);
            await sleep(500);
            setLog([nextRecord]);
            setMemoryRecords([nextRecord]);
            setLoading(false);
          }}
        >
          Add
        </ToggleButton>
        <ResetButton
          onClick={() => {
            setMemoryRecords([{ key: 10, value: "Lorem ipsum" }]);
            setDiskRecords([[]]);
            setLog([{ key: 10, value: "Lorem ipsum" }]);
          }}
        />
      </div>
      <Wide>
        <div
          className="bg-gray5 shadow-inner border-y md:border-x md:rounded-lg border-borderStrong grid grid-rows-[repeat(2,280px)] md:grid-rows-[300px] md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-borderStrong"
          ref={scope}
        >
          <div className="px-6 pt-3 pb-0 overflow-hidden relative">
            <p className="text-sm font-medium text-gray11 mb-3 text-center">
              Memory
            </p>
            <div className="flex flex-wrap absolute h-full left-1/2 -translate-x-1/2 w-[378px]">
              {Array.from({ length: 48 }).map((_, index) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  key={index}
                  className="w-[54px] h-[54px] ring-1 bg-gray5 ring-borderSoft"
                />
              ))}
            </div>
            <div className="p-[54px] relative flex flex-col items-center">
              {memoryRecords
                .sort((a, b) => a.key - b.key)
                .map((record) => (
                  <motion.div
                    key={record.key}
                    className={cn(
                      "w-[270px] h-[54px] bg-gray2 rounded-lg shadow-md ring-1 ring-neutral-950/15 flex items-center px-4 font-mono text-sm",
                      "memory",
                    )}
                    animate={{ y: 0 }}
                    initial={{ y: 200 }}
                    transition={{ type: "spring", damping: 20 }}
                    layout="position"
                  >
                    {String(record.key).padStart(3, "0")}: {record.value}
                  </motion.div>
                ))}
            </div>
          </div>
          {showLog ? (
            <div className="grid grid-cols-2 divide-x divide-borderStrong">
              {disk}
              <div className="px-6 pt-3 pb-0 overflow-hidden flex flex-col">
                <p className="text-sm font-medium text-gray11 mb-3 text-center">
                  On-Disk Log
                </p>
                <FileDatabase
                  className="w-[300px] translate-y-4"
                  records={log.map((record) => ({ value: record }))}
                />
              </div>
            </div>
          ) : (
            disk
          )}
        </div>
      </Wide>
    </>
  );
}
