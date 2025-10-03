"use client";

import { useState } from "react";
import { motion, useAnimate } from "motion/react";
import { ToggleButton } from "./toggle-button";
import { CommandList } from "./mutable-database";
import { sleep } from "~/lib/utils";
import { cn } from "~/lib/cn";
import { Wide } from "~/components/mdx/Wide";
import { pick } from "./utils";

const records = [
  [
    { key: 4, value: "dolor sit amet" },
    { key: 6, value: "adipiscing elit." },
    { key: 12, value: "consectetur elit." },
  ],
  [
    { key: 1, value: "Lorem ipsum" },
    { key: 18, value: "dolor sit" },
    { key: 7, value: "adipiscing elit." },
    { key: 10, value: "consectetur elit." },
    { key: 20, value: "Vestibulum varius" },
  ],
];

const firstSection = records[0];
const secondSection = records[1];

const getOffsetAtIndex = (
  records: { key: number; value: string }[],
  index: number,
) => {
  let offset = 0;
  for (let i = 0; i < index; i++) {
    offset += records[i].value.length + records[i].key.toString().length + 3;
  }
  return offset;
};

export function SearchIndex() {
  const [state, setState] = useState<"idle" | "second">("idle");
  const [commands, setCommands] = useState([]);
  const [scope, animate] = useAnimate();

  const bounce = async (selector: string) => {
    await animate(selector, { x: -5 });
    await animate(
      selector,
      { x: 0 },
      {
        type: "spring",
        stiffness: 300,
        damping: 10,
      },
    );
  };

  const animateFound = async (key: number, section: "first" | "second") => {
    await animate(
      `.${section}.key:not([data-key='${key}'])`,
      { scaleX: 0 },
      { duration: 0.3, bounce: 0 },
    );
    await sleep(100);
    await animate(
      `[data-key='${key}']`,
      { scaleX: 1 },
      { duration: 0.2, bounce: 0 },
    );
  };

  return (
    <>
      <div className="flex -mb-2">
        {/* <ToggleButton onClick={() => setState("idle")}>Idle</ToggleButton>
        <ToggleButton onClick={() => setState("second")}>Second</ToggleButton> */}
        <ToggleButton
          onClick={async () => {
            const keyToSearch = pick<number>(
              [
                ...firstSection.map((record) => record.key),
                ...secondSection.map((record) => record.key),
              ],
              new Set(commands.map((c) => c.key)),
            );
            setCommands((c) => [...c, { type: "get", key: keyToSearch }]);

            animate(".bg", { scaleX: 0 }, { duration: 0.2, bounce: 0 });

            if (state !== "idle") {
              setState("idle");
              await sleep(200);
            }

            await sleep(150);
            await animate(
              ".first.key",
              { scaleX: 1 },
              { duration: 0.2, bounce: 0 },
            );

            let record = firstSection.find(
              (record) => record.key === keyToSearch,
            );
            if (record) {
              await sleep(200);
              await animateFound(keyToSearch, "first");
            } else {
              await sleep(100);
              await bounce(".first.index");

              setState("second");
              animate(
                ".first.key",
                { scaleX: 0 },
                { duration: 0.2, bounce: 0 },
              );

              await sleep(200);
              await animate(
                ".second.key",
                { scaleX: 1 },
                { duration: 0.2, bounce: 0 },
              );

              record = secondSection.find(
                (record) => record.key === keyToSearch,
              );
              if (record) {
                await sleep(200);
                await animateFound(keyToSearch, "second");
              } else {
                await sleep(100);
                await bounce(".second.index");
                setCommands((c) => [
                  ...c,
                  { type: "result", value: `Key ${keyToSearch} not found` },
                ]);
                return;
              }
            }

            setCommands((c) => [...c, { type: "result", value: record.value }]);
          }}
        >
          Search
        </ToggleButton>
      </div>
      <Wide>
        <div
          className="grid grid-cols-[1fr_3fr] h-[300px] border border-borderStrong rounded-lg overflow-hidden"
          ref={scope}
        >
          <CommandList
            className="ring-0 shadow-none rounded-none border-r border-borderStrong h-full"
            commands={commands}
            showAll
          />
          <div className="bg-gray5 shadow-inner pr-4 pl-[19px] -ml-[5px] flex items-center overflow-hidden">
            <div className="grid grid-cols-[1fr_2fr] gap-4 w-fit mx-auto">
              <div className="relative">
                <motion.div
                  className="absolute inset-0 origin-top"
                  animate={{
                    scale: state === "idle" ? 0.9 : 1,
                    y: state === "idle" ? -10 : 0,
                  }}
                  initial={{
                    scale: 0.9,
                    y: -10,
                  }}
                  transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                >
                  <div
                    className={cn(
                      "grid font-mono text-sm gap-2 bg-gray3 rounded-md px-5 py-4 ring-1 ring-neutral-950/15 shadow origin-top h-[164px]",
                      "index second",
                    )}
                  >
                    {secondSection.map((record, index) => {
                      const offset = getOffsetAtIndex(secondSection, index);
                      return (
                        <span key={record.key} className="relative">
                          <span
                            className="absolute inset-0 -top-0.5 -bottom-0.5 bg-gray5 -mx-5 second key scale-x-0 origin-left bg"
                            data-key={record.key}
                          />
                          <span className="relative">
                            {String(record.key).padStart(3, "0")}: {offset}
                          </span>
                        </span>
                      );
                    })}
                  </div>
                </motion.div>
                <motion.div
                  className="relative"
                  animate={{
                    y: state === "second" ? 220 : 0,
                  }}
                  transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                >
                  <div
                    className={cn(
                      "grid font-mono text-sm gap-2 bg-gray3 rounded-md px-5 py-4 ring-1 ring-neutral-950/15 shadow origin-top h-[164px] auto-rows-min overflow-hidden",
                      "index first",
                    )}
                  >
                    {firstSection.map((record, index) => {
                      const offset = getOffsetAtIndex(firstSection, index);
                      return (
                        <span key={record.key} className="relative">
                          <span
                            className="absolute inset-0 -top-0.5 -bottom-0.5 bg-gray5 -mx-5 first key scale-x-0 origin-left bg"
                            data-key={record.key}
                          />
                          <span className="relative">
                            {String(record.key).padStart(3, "0")}: {offset}
                          </span>
                        </span>
                      );
                    })}
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
                  initial={{
                    scale: 0.95,
                    y: -10,
                  }}
                  transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                >
                  <div className="grid font-mono text-sm gap-2 bg-gray3 rounded-md px-5 py-4 ring-1 ring-neutral-950/15 shadow origin-top h-[164px]">
                    {secondSection.map((record) => {
                      return (
                        <span className="relative" key={record.key}>
                          <span
                            className="absolute inset-0 -top-0.5 -bottom-0.5 bg-blue5 -mx-5 scale-x-0 origin-left bg"
                            data-key={record.key}
                          />
                          <span className="relative">
                            {String(record.key).padStart(3, "0")}:{" "}
                            {record.value}
                          </span>
                        </span>
                      );
                    })}
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
                    {firstSection.map((record) => {
                      return (
                        <span className="relative" key={record.key}>
                          <span
                            className="absolute inset-0 -top-0.5 -bottom-0.5 bg-blue5 -mx-5 origin-left scale-x-0 bg"
                            data-key={record.key}
                          />
                          <span className="relative">
                            {String(record.key).padStart(3, "0")}:{" "}
                            {record.value}
                          </span>
                        </span>
                      );
                    })}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </Wide>
    </>
  );
}
