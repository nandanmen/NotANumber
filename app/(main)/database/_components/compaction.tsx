"use client";

import { ToggleButton } from "./toggle-button";
import { FileDatabase } from "./file-database";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "~/lib/cn";
import useInterval from "@use-it/interval";
import { DotAnimation } from "./dot-animation";
import { match } from "ts-pattern";
import { Wide } from "~/components/mdx/Wide";

const records = [
  { uuid: "1", id: 1, value: "Lorem ipsum", isStale: true },
  { uuid: "2", id: 18, value: "dolor sit", isStale: false },
  { uuid: "3", id: 7, value: "adipiscing elit.", isStale: true },
  { uuid: "4", id: 7, value: "null", isStale: true },
  { uuid: "5", id: 10, value: "consectetur adipiscing elit.", isStale: false },
  { uuid: "6", id: 1, value: "null", isStale: true },
  { uuid: "7", id: 20, value: "Vestibulum varius", isStale: false },
];

const steps = ["initial", "record-added", "compacting", "compacted"];

export function Compaction() {
  const [step, setStep] = useState(0);
  const [index, setIndex] = useState(0);
  const state = steps[step];

  useEffect(() => {
    if (state === "compacting") {
      setIndex(0);
    }
  }, [state]);

  useInterval(
    () => {
      if (index === records.length) {
        setStep((s) => s + 1);
      } else {
        setIndex((i) => i + 1);
      }
    },
    state === "compacting" ? 500 : null,
  );

  return (
    <>
      <div className="w-fit -mb-2">
        <ToggleButton
          onClick={() => {
            if (step > 0) {
              setStep(0);
              setTimeout(() => setStep(1), 1000);
              setTimeout(() => setStep(2), 2500);
            } else {
              setStep(1);
              setTimeout(() => {
                setStep(2);
              }, 1500);
            }
          }}
        >
          Add
        </ToggleButton>
      </div>
      <Wide className="bg-gray5 border-y md:border-x border-borderStrong md:rounded-lg shadow-inner overflow-hidden relative">
        <div
          className={cn(
            "grid w-max gap-5 lg:gap-10 mx-auto py-10",
            state === "record-added" || state === "compacted"
              ? "grid-cols-1 md:grid-cols-2"
              : "grid-cols-1",
          )}
        >
          <motion.ul
            layout="position"
            className={cn(
              "row-start-1 font-mono text-sm px-5 py-4 w-[300px] h-[250px] bg-gray3 rounded-lg relative ring-1 ring-neutral-950/15 shadow-sm",
              state === "record-added" &&
                "max-md:absolute max-md:left-[calc(100%-24px)]",
              state === "record-added" || state === "compacted"
                ? "col-start-1 md:col-start-2"
                : "col-start-1",
            )}
          >
            {records.map((record, i) => {
              return (
                <ListItem
                  key={record.uuid}
                  {...record}
                  isMarked={
                    record.isStale && i < index && state === "compacting"
                  }
                  isHighlighted={index === i && state === "compacting"}
                  className={cn(
                    "transition-opacity duration-300",
                    state === "compacted" &&
                      record.isStale &&
                      "top-4 opacity-0 absolute",
                  )}
                />
              );
            })}
          </motion.ul>
          <FileDatabase
            className={cn(
              "w-[300px] h-[250px] mx-[initial] row-start-1 col-start-1 md:opacity-0 transition-opacity duration-500 z-10 relative",
              state === "initial" && "absolute right-[calc(100%+4px)]",
              state !== "initial" && "md:opacity-100",
              state === "compacting" && "absolute right-[calc(100%-24px)]",
              state === "compacted" &&
                "max-md:absolute max-md:-bottom-12 max-md:ring-gray8",
            )}
            layout="position"
            records={
              state === "initial"
                ? []
                : [
                    {
                      type: "base",
                      value: { key: 10, value: "Lorem ipsum" },
                    },
                  ]
            }
          />
        </div>
        <div className="bg-gray4 py-2.5 text-center font-mono text-sm text-gray11 border-t border-gray8 italic relative z-10">
          {match(state)
            .with("initial", () => <DotAnimation>waiting</DotAnimation>)
            .with("record-added", () => (
              <DotAnimation>database full! adding to new file</DotAnimation>
            ))
            .with("compacting", () => <DotAnimation>compacting</DotAnimation>)
            .with("compacted", () => "done!")
            .otherwise(() => null)}
        </div>
        {/* <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex gap-2">
            <ToggleButton onClick={() => setStep(0)}>initial</ToggleButton>
            <ToggleButton onClick={() => setStep(1)}>record-added</ToggleButton>
            <ToggleButton onClick={() => setStep(2)}>compacting</ToggleButton>
            <ToggleButton onClick={() => setStep(3)}>compacted</ToggleButton>
          </div>
        </div> */}
      </Wide>
    </>
  );
}

function ListItem({
  id,
  value,
  isStale,
  isMarked,
  isHighlighted,
  className,
}: {
  id: number;
  value: string;
  isStale: boolean;
  isMarked?: boolean;
  isHighlighted?: boolean;
  className?: string;
}) {
  return (
    <motion.li
      layout="position"
      className={cn(
        "flex gap-2 py-1 -mx-5 px-5",
        isStale && "text-gray9",
        isMarked && "bg-gray4",
        isHighlighted && "text-blue11 bg-blue5",
        className,
      )}
    >
      <p className="font-medium">{String(id).padStart(3, "0")}: </p>
      <p>{value}</p>
      {isMarked && (
        <svg
          className="shrink-0 ml-auto mt-[3px]"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <motion.path
            d="M5 5L19 19"
            animate={{
              pathLength: 1,
            }}
            initial={{ pathLength: 0 }}
            transition={{ duration: 0.25 }}
          />
          <motion.path
            d="M19 5L5 19"
            animate={{
              pathLength: 1,
            }}
            initial={{ pathLength: 0 }}
            transition={{ duration: 0.25, delay: 0.25 }}
          />
        </svg>
      )}
    </motion.li>
  );
}
