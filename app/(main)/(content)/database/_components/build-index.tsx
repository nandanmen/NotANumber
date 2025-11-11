"use client";

import { FullWidth } from "~/components/mdx/full-width";
import { ToggleButton } from "./toggle-button";
import { useMemo, useState } from "react";
import { useAnimate, motion, useTransform, useMotionValue } from "motion/react";
import { DotAnimation } from "./dot-animation";
import { TRANSITIONS } from "~/lib/transitions";

const records = [
  { uuid: "1", id: 1, value: "Lorem ipsum" },
  { uuid: "2", id: 18, value: "dolor sit" },
  { uuid: "3", id: 7, value: "adipiscing elit." },
  { uuid: "5", id: 10, value: "consectetur elit." },
  { uuid: "7", id: 20, value: "Vestibulum varius" },
];

type Record = {
  uuid: string;
  id: number;
  value: string;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getOffsetAtIndex = (index: number) => {
  let offset = 0;
  for (let i = 0; i < index; i++) {
    offset += records[i].value.length + records[i].id.toString().length + 3;
  }
  return offset;
};

export function BuildIndex() {
  const [index, setIndex] = useState(0);
  const [scope, animate] = useAnimate();

  const activeRecords = records.slice(0, index + 1);
  const offsetValue = useMotionValue(0);
  const transform = useTransform(
    offsetValue,
    (v) => `translateX(calc(-1 * ${v} * 1ch))`,
  );

  const nextRecord = records[index];
  const nextOffset = useMemo(() => {
    let offset = 0;
    for (const record of activeRecords) {
      offset += record.value.length + record.id.toString().length + 3;
    }
    return offset;
  }, [activeRecords]);

  return (
    <>
      <div className="w-fit">
        <ToggleButton
          onClick={async () => {
            if (index === records.length) {
              await animate("[data-record-cover]", {
                scaleX: 1,
              });
              setIndex(0);
              offsetValue.set(0);
              return;
            }
            await Promise.all([
              animate(
                "[data-name='next-record']",
                {
                  width: "fit-content",
                },
                TRANSITIONS.swift,
              ),
              animate(
                "[data-record-cover]",
                {
                  scaleX: 0,
                },
                TRANSITIONS.swift,
              ),
            ]);
            await sleep(50);
            await Promise.all([
              animate(offsetValue, nextOffset, TRANSITIONS.swift),
              animate("[data-file]", { x: "-100%" }, TRANSITIONS.swift),
            ]);
            setIndex((i) => Math.min(i + 1, records.length));
          }}
        >
          {index === records.length ? "Reset" : "Add record"}
        </ToggleButton>
      </div>
      <FullWidth>
        <div
          className="border-y border-gray8 md:rounded-lg grid grid-rows-[repeat(2,250px)] md:grid-rows-[250px] md:grid-cols-2 lg:grid-cols-[3fr_2fr] overflow-hidden font-mono text-sm divide-y md:divide-y-0 md:divide-x divide-gray8 -mx-6 md:mx-0 md:border-x"
          ref={scope}
        >
          <div className="flex flex-col">
            <p className="text-gray10 text-sm font-medium font-sans p-3 pb-0">
              file.txt
            </p>
            <div className="flex items-center pl-[28%] text-2xl relative overflow-hidden grow">
              <motion.p className="text-gray10 absolute" style={{ transform }}>
                {activeRecords
                  .map(
                    (record) =>
                      `${record.id}:${record.value.replaceAll(" ", "␣")}\\n`,
                  )
                  .join("")}
              </motion.p>
              <div className="h-20 flex items-center relative grow">
                <div className="absolute bottom-0 -left-2 -translate-x-px">
                  <motion.p className="text-sm w-4 text-center">
                    {useTransform(offsetValue, (v) => v.toFixed(0))}
                  </motion.p>
                  <svg
                    width="16"
                    viewBox="0 0 24 140"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3.37988 4H20.616L11.9979 21.2361L3.37988 4Z"
                      fill="currentColor"
                    />
                    <path d="M12 21 V140" stroke="currentColor" />
                  </svg>
                </div>
                <div className="absolute text-gray8 italic">
                  <DotAnimation>Waiting</DotAnimation>
                </div>
                <motion.div className="bg-gray4 grow overflow-hidden">
                  {nextRecord && (
                    <motion.p
                      className="border-r border-gray9 h-12 flex items-center overflow-hidden -translate-x-px bg-gray4"
                      data-name="next-record"
                      data-file
                      initial={{ width: 0 }}
                      key={nextRecord.uuid}
                    >
                      <span>
                        {nextRecord.id}:{nextRecord.value.replaceAll(" ", "␣")}
                        \n
                      </span>
                    </motion.p>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-[1fr_2fr] px-6 bg-gray5 shadow-inner gap-3">
            <div className="flex flex-col">
              <p className="text-gray10 text-sm font-medium font-sans py-3">
                Index
              </p>
              <ul className="px-5 py-4 bg-gray3 shadow rounded-md rounded-b-none ring-1 ring-neutral-950/15 grow relative">
                {activeRecords.map((record, index) => {
                  const offset = getOffsetAtIndex(index);
                  return (
                    <RecordItem
                      record={{
                        ...record,
                        value: String(offset),
                      }}
                      isNext={index === activeRecords.length - 1}
                      key={record.uuid}
                    />
                  );
                })}
              </ul>
            </div>
            <div className="flex flex-col">
              <p className="text-gray10 text-sm font-medium font-sans py-3">
                Database
              </p>
              <ul className="px-5 py-4 bg-gray3 shadow rounded-md rounded-b-none ring-1 ring-neutral-950/15 grow relative">
                {activeRecords.map((record, index) => (
                  <RecordItem
                    record={record}
                    isNext={index === activeRecords.length - 1}
                    key={record.uuid}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </FullWidth>
    </>
  );
}

function RecordItem({ record, isNext }: { record: Record; isNext?: boolean }) {
  return (
    <li className="relative">
      <div className="flex gap-2 py-1">
        <p className="font-medium">{String(record.id).padStart(3, "0")}: </p>
        <p>{record.value}</p>
      </div>
      <div
        className="absolute inset-0 bg-gray3 origin-right"
        data-record-cover
        data-name={isNext ? "next-record-cover" : undefined}
      />
    </li>
  );
}
