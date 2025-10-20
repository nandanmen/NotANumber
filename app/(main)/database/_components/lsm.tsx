"use client";

import { Wide } from "~/components/mdx/Wide";
import { ResetButton, ToggleButton } from "./toggle-button";
import { FileDatabase } from "./file-database";
import { useEffect, useState } from "react";
import { motion, stagger, useAnimate } from "motion/react";
import { getNextRecord } from "./mutable-database";
import { cn } from "~/lib/cn";
import { delay, sleep } from "~/lib/utils";
import {
  useActiveIndex,
  useScrollGroupEvents,
  useSectionIndex,
} from "~/components/mdx/scroll-group";
import { DatabaseIndex, getIndexRecords } from "./update-index";
import { nanoid } from "nanoid";
import { CompactionInner, useCompactionAnimation } from "./compaction";

const MEMORY_LIMIT = 3;

function MemoryBackground({ align }: { align?: "center" | "left" }) {
  return (
    <div
      className={cn(
        "flex flex-wrap absolute h-full w-[378px] top-[44px]",
        align === "center" ? "left-1/2 -translate-x-1/2 " : "left-0",
      )}
    >
      {Array.from({ length: 48 }).map((_, index) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          key={index}
          className="w-[54px] h-[54px] ring-1 bg-gray5 ring-borderSoft"
        />
      ))}
    </div>
  );
}

function MemoryVisual({
  align = "center",
  highlight,
  records,
}: {
  align?: "center" | "left";
  highlight?: number;
  records: { key: number; value: string; id?: string }[];
}) {
  const sorted = [...records].sort((a, b) => a.key - b.key);
  return (
    <>
      <MemoryBackground align={align} />
      <ul
        className={cn(
          "relative flex flex-col",
          align === "center" ? "px-[54px] items-center" : "items-start",
        )}
      >
        {sorted.map((record, i) => {
          const content = (
            <>
              {String(record.key).padStart(3, "0")}: {record.value}
            </>
          );
          const afterExists = sorted
            .slice(i + 1)
            .some((r) => r.key === record.key);
          const isStale = record.value === "null" || afterExists;
          return (
            <motion.li
              key={record.id ?? record.key}
              className={cn(
                "w-[270px] h-[54px] bg-gray2 rounded-lg shadow-md ring-1 ring-neutral-950/15 flex items-center px-4 font-mono text-sm relative transition-colors",
                isStale && "text-gray9",
                "memory",
              )}
              animate={{ y: 0 }}
              initial={{ y: 200 }}
              transition={{ type: "spring", damping: 20 }}
              layout="position"
            >
              <span
                className={cn(
                  "absolute left-0 right-0 top-2 bottom-2 w-0 overflow-hidden text-nowrap",
                  highlight === i && "w-full",
                )}
              >
                <span className="px-4 bg-blue5 text-blue11 flex items-center h-full">
                  {content}
                </span>
              </span>
              <span>{content}</span>
            </motion.li>
          );
        })}
      </ul>
    </>
  );
}

const useLSMEvents = () =>
  useScrollGroupEvents<
    "add" | "reset" | "search" | "update" | "delete",
    {
      add: number;
      reset: never;
      search: number;
      update: never;
      delete: never;
    }
  >();

export function MobileWrapper({ children }: { children: React.ReactNode }) {
  const [pressCount, setPressCount] = useState(0);
  const [updateCount, setUpdateCount] = useState(0);
  const [deleteCount, setDeleteCount] = useState(0);
  const events = useLSMEvents();
  const index = useSectionIndex();
  return (
    <>
      <div className="-mb-2 flex gap-2">
        {index < 2 && (
          <ToggleButton
            onClick={() => {
              events.notify("add", index);
              setPressCount(pressCount + 1);
            }}
            disabled={index === 0 && pressCount >= MEMORY_LIMIT - 1}
          >
            Add
          </ToggleButton>
        )}
        {index === 3 && (
          <>
            <ToggleButton
              onClick={() => {
                events.notify("update");
                setUpdateCount(updateCount + 1);
              }}
              disabled={updateCount > 0}
            >
              Update
            </ToggleButton>
            <ToggleButton
              onClick={() => {
                events.notify("delete");
                setDeleteCount(deleteCount + 1);
              }}
              disabled={deleteCount > 0}
            >
              Delete
            </ToggleButton>
          </>
        )}
        {index === 2 && (
          <ToggleButton
            onClick={() => {
              events.notify("search", index);
            }}
          >
            Search
          </ToggleButton>
        )}
        {index !== 2 && (
          <ResetButton
            onClick={() => {
              events.notify("reset");
              setPressCount(0);
              setUpdateCount(0);
              setDeleteCount(0);
            }}
          />
        )}
      </div>
      <figure className="bg-gray5 shadow-inner border-y md:border-x md:rounded-lg border-borderStrong -mx-6 lg:hidden overflow-hidden">
        {children}
      </figure>
    </>
  );
}

function LSMSection({
  title,
  icon,
  align = "center",
  children,
  className,
}: {
  title: string;
  icon?: React.ReactNode;
  align?: "center" | "left";
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "px-6 pt-3 pb-0 relative overflow-hidden h-full",
        className,
      )}
    >
      <p
        className={cn(
          "text-sm font-medium text-gray11 mb-3 justify-center flex items-center gap-1",
          align === "left" && "text-left justify-between",
        )}
      >
        {title}
        <span>{icon}</span>
      </p>
      {children}
    </div>
  );
}

type LSMState = {
  records: { key: number; value: string }[];
  diskRecords: { key: number; value: string }[][];
};

const states: LSMState[] = [
  {
    records: [{ key: 10, value: "Lorem ipsum" }],
    diskRecords: [[]],
  },
  {
    records: [
      { key: 10, value: "Lorem ipsum" },
      { key: 4, value: "dolor sit" },
      { key: 12, value: "consectetur elit." },
    ],
    diskRecords: [[]],
  },
  {
    records: [
      { key: 20, value: "Vestibulum varius" },
      { key: 11, value: "amet, consectetur" },
    ],
    diskRecords: [
      [
        { key: 10, value: "Lorem ipsum" },
        { key: 4, value: "dolor sit" },
        { key: 12, value: "consectetur elit." },
      ],
    ],
  },
  {
    records: [
      { key: 10, value: "Lorem ipsum" },
      { key: 4, value: "dolor sit" },
      { key: 12, value: "consectetur elit." },
    ],
    diskRecords: [[]],
  },
];

const initial = [
  { key: 10, value: "Lorem ipsum", id: nanoid() },
  { key: 4, value: "dolor sit", id: nanoid() },
  { key: 12, value: "consectetur elit.", id: nanoid() },
];

function ImmutableMemory() {
  const events = useLSMEvents();
  const [records, setRecords] =
    useState<{ key: number; value: string; id?: string }[]>(initial);

  useEffect(() => {
    return events.on("update", () => {
      setRecords((r) => [...r, { key: 10, value: "dolor sit", id: nanoid() }]);
    });
  }, [events]);

  useEffect(() => {
    return events.on("delete", () => {
      setRecords((r) => [...r, { key: 12, value: "null", id: nanoid() }]);
    });
  }, [events]);

  useEffect(() => {
    return events.on("reset", () => {
      setRecords(initial);
    });
  });

  return (
    <div className="h-[350px]">
      <LSMSection title="Memory" icon={<MemoryIcon />} align="center">
        <MemoryVisual align="center" records={records} />
      </LSMSection>
    </div>
  );
}

export function CompactionControls() {
  const events = useLSMEvents();
  return (
    <div className="hidden lg:flex gap-2">
      <ToggleButton onClick={() => events.notify("add")}>Add</ToggleButton>
    </div>
  );
}

function CompactionWrapper() {
  const events = useLSMEvents();
  const { step, index, play } = useCompactionAnimation();

  useEffect(() => {
    return events.on("add", () => {
      play();
    });
  }, [events, play]);

  return (
    <div style={{ "--card-width": "250px" } as React.CSSProperties}>
      <CompactionInner
        step={step}
        index={index}
        showConsole={false}
        highlightCompactionAtEnd={true}
      />
    </div>
  );
}

export function LSMVisual({ index }: { index?: number }) {
  const events = useLSMEvents();
  const scrollIndex = useActiveIndex();

  const [scope, animate] = useAnimate();
  const [state, setState] = useState<LSMState>(states[index ?? 0]);
  const [search, setSearch] = useState<number | null>(null);

  const { records, diskRecords } = state;
  const isControlled = typeof index === "number";
  const i = index ?? scrollIndex;

  useEffect(() => {
    const state = states[i ?? 0];
    if (!state) return;
    setState(state);
  }, [i]);

  useEffect(() => {
    return events.on("reset", () => {
      setState(states[index ?? 0]);
    });
  }, [events, index]);

  useEffect(() => {
    return events.on("search", async (i) => {
      if (i !== index && isControlled) return;

      await Promise.all([
        animate(".file-highlight", { width: 0 }, { type: false }),
        animate(".index-highlight", { scaleX: 0 }, { type: false }),
      ]);

      setSearch(0);

      let interval: NodeJS.Timeout;
      await new Promise<void>((resolve) => {
        interval = setInterval(() => {
          setSearch((s) => {
            if (s === null) {
              resolve();
              return null;
            }
            if (s === records.length - 1) {
              resolve();
              return null;
            }
            return s + 1;
          });
        }, 500);
      });
      clearInterval(interval);

      animate(
        ".index-highlight",
        { scaleX: 1 },
        { type: "spring", bounce: 0, duration: 0.8, delay: stagger(0.1) },
      );
      await sleep(500);
      animate(
        ".index-highlight:not([data-key='10'])",
        { scaleX: 0 },
        { type: "spring", bounce: 0, duration: 0.8 },
      );
      await sleep(500);

      animate(
        ".file-highlight[data-key='10']",
        { width: "100%" },
        { type: "spring", bounce: 0, duration: 0.8 },
      );
    });
  }, [events, records.length, index, animate, isControlled]);

  useEffect(() => {
    return events.on("add", async (i) => {
      if (i !== index && isControlled) return;
      const nextRecord = getNextRecord(records);

      if (records.length < MEMORY_LIMIT) {
        setState((s) => ({ ...s, records: [...s.records, nextRecord] }));
        return;
      }

      const isLatestEmpty = diskRecords.at(-1)?.length === 0;
      if (!isLatestEmpty) {
        setState((s) => ({ ...s, diskRecords: [...s.diskRecords, []] }));
      }

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

      const staggeredWrites = records.map((record, index) =>
        delay(index * 100, () => {
          setState((s) => {
            const latest = s.diskRecords.at(-1);
            const rest = s.diskRecords.slice(0, -1);
            return {
              ...s,
              diskRecords: [...rest, [...latest, record]],
            };
          });
        }),
      );

      await Promise.all(staggeredWrites);
      await sleep(500);
      setState((s) => ({ ...s, records: [nextRecord] }));
    });
  }, [events, records, diskRecords, animate, index, isControlled]);

  if (i === 3) return <ImmutableMemory />;
  if (i === 4) return <CompactionWrapper />;

  return (
    <div
      ref={scope}
      className={cn(
        "grid grid-rows-[230px] md:grid-rows-[300px] divide-y divide-borderStrong lg:max-w-[500px] lg:mx-auto border-borderStrong",
        i === 0 && "lg:grid-rows-[250px] lg:border-b lg:border-r",
        i > 0 &&
          "grid-rows-[repeat(2,230px)] md:grid-rows-[230px_300px] lg:border-r",
      )}
    >
      <div
        className={cn(
          // "w-screen md:w-full overflow-hidden",
          "grid grid-cols-2 divide-x divide-borderStrong",
          i === 2 && "grid-cols-1",
        )}
      >
        <LSMSection
          title="Memory"
          icon={<MemoryIcon />}
          align={i === 2 ? "center" : "left"}
        >
          <MemoryVisual
            highlight={search ?? undefined}
            align={i === 2 ? "center" : "left"}
            records={records}
          />
        </LSMSection>
        {i !== 2 && (
          <LSMSection title="On-Disk Log" icon={<DiskIcon />} align="left">
            <FileDatabase
              className="w-[270px] h-[300px]"
              records={records.map((record) => ({ value: record }))}
            />
          </LSMSection>
        )}
      </div>
      {i > 0 && (
        <div
          className={cn(
            //"w-screen overflow-hidden",
            "grid grid-cols-2 divide-x divide-borderStrong",
          )}
        >
          <LSMSection
            className="flex flex-col"
            title="Index"
            icon={<MemoryIcon />}
            align="left"
          >
            <MemoryBackground align="left" />
            <div className={cn("grow -mt-6 flex items-center relative")}>
              {diskRecords.map((segment, i) => {
                const inverseIndex = diskRecords.length - i - 1;
                return (
                  <DatabaseIndex
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    key={i}
                    className="w-[270px] h-[116px] absolute"
                    items={getIndexRecords(segment)}
                    animate={{
                      y: inverseIndex * -16,
                      scale: 1 - inverseIndex * 0.08,
                      backgroundColor: `hsl(0 0% ${97.3 - inverseIndex * 2.5}%)`,
                      "--tw-ring-color": `rgb(10 10 10 / ${0.15 - inverseIndex * 0.02})`,
                    }}
                    initial={{ y: 200 }}
                    transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                  />
                );
              })}
            </div>
          </LSMSection>
          <LSMSection
            className="flex flex-col"
            title="On-Disk Database"
            icon={<DiskIcon />}
            align="left"
          >
            <DiskSegments segments={diskRecords} align="left" />
          </LSMSection>
        </div>
      )}
    </div>
  );
}

function DiskSegments({
  segments,
  align = "center",
  className,
}: {
  segments: { key: number; value: string }[][];
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grow -mt-6 flex items-center relative",
        align === "center" && "justify-center",
      )}
    >
      {segments.map((segment, i) => {
        const inverseIndex = segments.length - i - 1;
        return (
          <FileDatabase
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            key={i}
            className={cn("h-[116px] w-[270px] absolute", className)}
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
  );
}

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
      <DiskSegments
        segments={diskRecords}
        align={showLog ? "left" : "center"}
      />
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
          className="bg-gray5 shadow-inner border-y md:border-x md:rounded-lg border-borderStrong grid grid-rows-[repeat(2,230px)] md:grid-rows-[250px] md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-borderStrong"
          ref={scope}
        >
          <div className="px-6 pt-3 pb-0 overflow-hidden relative">
            <p className="text-sm font-medium text-gray11 mb-3 text-center">
              Memory
            </p>
            <MemoryVisual records={memoryRecords} />
          </div>
          {showLog ? (
            <div className="grid grid-cols-2 divide-x divide-borderStrong">
              {disk}
              <div className="px-6 pt-3 pb-0 overflow-hidden">
                <p className="text-sm font-medium text-gray11 mb-3 text-center">
                  On-Disk Log
                </p>
                <FileDatabase
                  className="w-[300px] h-[300px]"
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

function DiskIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      width="16"
    >
      <path d="M7 3H6C4.34315 3 3 4.34315 3 6V18C3 19.6569 4.34315 21 6 21H7V14C7 12.8954 7.89543 12 9 12H15C16.1046 12 17 12.8954 17 14V21H18C19.6569 21 21 19.6569 21 18V7.82843C21 7.03278 20.6839 6.26972 20.1213 5.70711L18.2929 3.87868C17.9302 3.51602 17.4843 3.2558 17 3.11664V7C17 8.10457 16.1046 9 15 9H9C7.89543 9 7 8.10457 7 7V3Z" />
      <path d="M15 3H9V7H15V3Z" />
      <path d="M15 21V14H9V21H15Z" />
    </svg>
  );
}

function MemoryIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      width="16"
    >
      <path d="M3.0025 5.99945C3.0025 4.34398 4.34453 3.00195 6 3.00195H8C9.65548 3.00195 10.9975 4.34398 10.9975 5.99945V7.99945C10.9975 9.65493 9.65548 10.997 8 10.997H6C4.34453 10.997 3.0025 9.65493 3.0025 7.99945V5.99945Z" />
      <path d="M3.0025 15.9995C3.0025 14.344 4.34453 13.002 6 13.002H8C9.65548 13.002 10.9975 14.344 10.9975 15.9995V17.9995C10.9975 19.6549 9.65548 20.997 8 20.997H6C4.34453 20.997 3.0025 19.6549 3.0025 17.9995V15.9995Z" />
      <path d="M13.0025 5.99945C13.0025 4.34398 14.3445 3.00195 16 3.00195H18C19.6555 3.00195 20.9975 4.34398 20.9975 5.99945V7.99945C20.9975 9.65493 19.6555 10.997 18 10.997H16C14.3445 10.997 13.0025 9.65493 13.0025 7.99945V5.99945Z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17 13.002C14.7922 13.002 13.0025 14.7917 13.0025 16.9995C13.0025 19.2072 14.7922 20.997 17 20.997C19.2078 20.997 20.9975 19.2072 20.9975 16.9995C20.9975 14.7917 19.2078 13.002 17 13.002ZM14.9975 16.9995C14.9975 15.8935 15.8941 14.997 17 14.997C18.106 14.997 19.0025 15.8935 19.0025 16.9995C19.0025 18.1054 18.106 19.002 17 19.002C15.8941 19.002 14.9975 18.1054 14.9975 16.9995Z"
      />
    </svg>
  );
}
