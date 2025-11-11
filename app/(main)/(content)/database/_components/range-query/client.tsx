"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Wide } from "~/components/mdx/Wide";
import { IconButton } from "../toggle-button";
import { useInterval } from "~/lib/use-interval";
import { cn } from "~/lib/cn";
import { Slider, SliderMarker } from "../slider";

type Snapshot = {
  items: number[];
  i: number;
  message: string;
};

export function RangeQueryClient({
  snapshots,
  inputs,
}: {
  inputs: {
    sorted: number[];
    unsorted: number[];
  };
  snapshots: {
    sorted: Array<Snapshot>;
    unsorted: Array<Snapshot>;
  };
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [index, setIndex] = useState(0);

  useInterval(
    () => {
      setIndex((index) => {
        if (index === snapshots.unsorted.length - 1) {
          setIsPlaying(false);
          return index;
        }
        return index + 1;
      });
    },
    { delay: isPlaying ? 700 : null },
  );

  const currentSortedSnapshot =
    snapshots.sorted[index] ?? snapshots.sorted.at(-1);
  const currentUnsortedSnapshot = snapshots.unsorted[index];
  return (
    <>
      <Wide className="flex items-center gap-3 px-8">
        <IconButton
          label={isPlaying ? "Pause" : "Play"}
          className="shrink-0"
          onClick={() => {
            setIndex(0);
            setIsPlaying(!isPlaying);
          }}
        >
          {isPlaying ? (
            <svg
              width="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M4 5C4 3.89543 4.89543 3 6 3H8C9.10457 3 10 3.89543 10 5V19C10 20.1046 9.10457 21 8 21H6C4.89543 21 4 20.1046 4 19V5Z" />
              <path d="M14 5C14 3.89543 14.8954 3 16 3H18C19.1046 3 20 3.89543 20 5V19C20 20.1046 19.1046 21 18 21H16C14.8954 21 14 20.1046 14 19V5Z" />
            </svg>
          ) : (
            <svg
              width="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8.04074 2.32259C6.70797 1.51044 5 2.46975 5 4.03047V19.9696C5 21.5304 6.70798 22.4897 8.04074 21.6775L21.119 13.7079C22.398 12.9285 22.398 11.0716 21.119 10.2922L8.04074 2.32259Z" />
            </svg>
          )}
        </IconButton>
        <Slider
          value={index}
          onChange={(i) => setIndex(i as number)}
          minValue={0}
          maxValue={snapshots.unsorted.length - 1}
        >
          <SliderMarker value={snapshots.sorted.length - 1}>
            <svg
              width="12"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M19.3209 4.24472C20.0143 4.69807 20.2088 5.62768 19.7555 6.32105L11.2555 19.321C10.9972 19.7161 10.5681 19.9665 10.0971 19.997C9.62616 20.0276 9.16828 19.8347 8.86114 19.4764L4.36114 14.2264C3.82201 13.5974 3.89485 12.6504 4.52384 12.1113C5.15283 11.5722 6.09978 11.645 6.63891 12.274L9.83828 16.0066L17.2446 4.6793C17.6979 3.98593 18.6275 3.79136 19.3209 4.24472Z"
                fill="white"
              />
            </svg>
          </SliderMarker>
        </Slider>
        <p className="text-gray10 text-sm shrink-0 w-8 text-right">
          {index} / {snapshots.unsorted.length - 1}
        </p>
      </Wide>
      <Wide>
        <div className="bg-gray5 border-y md:border-x border-gray8 md:rounded-lg shadow-inner overflow-hidden relative grid grid-rows-[repeat(2,250px)] lg:grid-rows-[300px] lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray8">
          <div className="flex items-center justify-center relative">
            <p className="text-gray10 font-medium text-sm absolute top-3 left-3">
              Unsorted
            </p>
            <p className="text-gray10 text-sm absolute top-3 right-3">
              Find all values &gt; 2 and &lt; 6
            </p>
            <List values={inputs.unsorted} snapshot={currentUnsortedSnapshot} />
            <p className="text-gray10 text-sm absolute bottom-3 w-full text-center">
              {currentUnsortedSnapshot?.message}
            </p>
          </div>
          <div className="flex items-center justify-center relative">
            <p className="text-gray10 font-medium text-sm absolute top-3 left-3">
              Sorted
            </p>
            <p className="text-gray10 text-sm absolute top-3 right-3">
              Find all values &gt; 2 and &lt; 6
            </p>
            <List values={inputs.sorted} snapshot={currentSortedSnapshot} />
            <p className="text-gray10 text-sm absolute bottom-3 w-full text-center">
              {currentSortedSnapshot?.message}
            </p>
          </div>
        </div>
      </Wide>
    </>
  );
}

function List({
  values,
  snapshot,
}: {
  values: number[];
  snapshot?: Snapshot;
}) {
  return (
    <ul className="flex gap-2">
      {values.map((number, i) => {
        const isInSnapshot = snapshot?.items.includes(number);
        const isCurrent = snapshot?.i === i;
        return (
          <motion.li
            className={cn(
              "w-12 h-12 bg-gray2 flex items-center justify-center rounded-lg shadow ring-1 ring-neutral-950/15 text-lg font-mono transition-colors",
              !isCurrent && !isInSnapshot && "bg-gray4 shadow-xs text-gray10",
              /* isInSnapshot && "bg-gray12 text-white ring-2 ring-gray8", */
            )}
            key={number}
            animate={{
              y: isInSnapshot || isCurrent ? 0 : 6,
            }}
          >
            <span className="translate-y-px">{number}</span>
          </motion.li>
        );
      })}
    </ul>
  );
}
