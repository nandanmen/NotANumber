"use client";

import { useAnimate } from "motion/react";
import { Wide } from "~/components/mdx/Wide";
import { FileDatabase } from "./file-database";
import { createStore } from "../_lib/file-database";
import { toFileDatabaseRecords } from "./mutable-database";
import { DatabaseIndex, getIndexRecords } from "./update-index";
import {
  useFileDatabase,
  type ExecutableDatabaseCommand,
} from "../_lib/use-file-database";
import { useMemo, useState } from "react";
import { ToggleButton } from "./toggle-button";
import { useInterval } from "~/lib/use-interval";

const records: ExecutableDatabaseCommand[] = [
  { type: "set", key: 1, value: "Lorem ipsum" },
  { type: "set", key: 18, value: "dolor sit" },
  { type: "set", key: 7, value: "amet, consectetur" },
  { type: "set", key: 10, value: "adipiscing elit." },
];

const sortedRecords = records.sort((a, b) => a.key - b.key);

export function SparseIndex({ sorted = false }: { sorted?: boolean }) {
  const store = useMemo(
    () => createStore(sorted ? sortedRecords : records),
    [sorted],
  );
  return (
    <Wide>
      <div className="bg-gray5 shadow-inner border-y md:border-x md:rounded-lg border-borderStrong h-[200px] md:h-[250px] grid grid-cols-[1fr_140px] md:grid-cols-[2fr_1fr] divide-x divide-borderStrong">
        <div className="pl-6 pt-3 overflow-hidden h-full">
          <FileDatabase
            className="translate-y-4 w-[300px]"
            records={toFileDatabaseRecords(store)}
          />
        </div>
        <div className="pl-6 pt-3 overflow-hidden h-full">
          <DatabaseIndex
            className="translate-y-4 w-[200px] md:mx-auto h-full"
            items={
              sorted
                ? [{ key: "10", offset: 36 }]
                : getIndexRecords(store.records)
            }
          />
        </div>
      </div>
    </Wide>
  );
}

const text = "010: adipiscing elit.";

export function SearchSparseIndex() {
  const [scope, animate] = useAnimate();
  const [offset, setOffset] = useState(0);
  const [playing, setPlaying] = useState(false);

  useInterval(
    () => {
      if (playing) {
        setOffset((offset) => {
          if (offset === text.length) {
            setPlaying(false);

            animate(".ten-bg", { opacity: 0 }, { type: false });
            setTimeout(() => {
              animate(
                ".active",
                { width: "100%" },
                { bounce: 0, duration: 0.4 },
              );
            }, 200);

            return offset;
          }
          return offset + 1;
        });
      }
    },
    { delay: playing ? 200 : null },
  );

  const reset = () => {
    setOffset(0);
    animate(".ten-bg", { opacity: 1 }, { type: false });
    animate(".active", { width: 0 });
  };

  return (
    <>
      <div className="flex -mb-2 h-8 items-center">
        <ToggleButton
          onClick={() => {
            reset();
            setPlaying(true);
          }}
          loading={playing}
        >
          Search
        </ToggleButton>
      </div>
      <Wide>
        <div
          className="bg-gray5 shadow-inner border-y md:border-x md:rounded-lg border-borderStrong h-[200px] md:h-[250px] grid grid-cols-[1fr_140px] md:grid-cols-[2fr_1fr] divide-x divide-borderStrong"
          ref={scope}
        >
          <div className="pl-6 pt-3 overflow-hidden h-full">
            <ul className="bg-gray2 rounded-lg h-full ring-1 ring-neutral-950/15 mx-auto text-sm py-4 shadow-md font-mono translate-y-4 w-[300px]">
              <li className="flex gap-2 py-1 px-5">001: Lorem ipsum</li>
              <li className="flex gap-2 py-1 px-5">007: amet, consectetur</li>
              <li className="flex gap-2 py-1 px-5 relative">
                <span
                  className="h-[1lh] w-[1ch] bg-blue5 text-blue11 absolute ten-bg"
                  style={{
                    translate: `${offset}ch`,
                  }}
                >
                  {text.at(offset)}
                </span>
                <span>010: adipiscing elit.</span>
              </li>
              <div className="relative">
                <li className="flex gap-2 py-1 px-5">
                  <span>018: dolor sit</span>
                  <span className="h-[1lh] w-[1ch] bg-blue5 text-blue11 absolute opacity-0 eight-bg">
                    0
                  </span>
                </li>
                <div className="absolute top-0 active overflow-hidden w-0">
                  <li className="bg-blue5 text-blue11 flex gap-2 py-1 px-5 whitespace-nowrap">
                    018: dolor sit
                  </li>
                </div>
              </div>
            </ul>
          </div>
          <div className="pl-6 pt-3 overflow-hidden h-full">
            <DatabaseIndex
              className="translate-y-4 w-[200px] md:mx-auto h-full"
              items={[{ key: "10", offset: 36 }]}
            />
          </div>
        </div>
      </Wide>
    </>
  );
}
