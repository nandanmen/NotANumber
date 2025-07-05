"use client";

import { atom, useAtom, useAtomValue } from "jotai";
import { motion } from "framer-motion";
import { random, randomUnique, texts, pick } from "./utils";
import { ResetButton, ToggleButton } from "./toggle-button";
import { FileDatabase } from "./file-database";
import {
  createStore,
  useFileDatabase,
  type DatabaseCommand,
  type ExecutableDatabaseCommand,
} from "../_lib/use-file-database";
import { useEffect, useRef } from "react";

const defaultCommands: ExecutableDatabaseCommand[] = [
  { type: "set", key: 1, value: "Lorem ipsum" },
  { type: "set", key: 18, value: "dolor sit" },
];
const initialStore = createStore(defaultCommands);

const dbStore = atom(initialStore);

type Mode = "add" | "update" | "delete" | "search";

export function FileDatabaseControls({
  mode,
  mutable = false,
}: {
  mode?: Mode[];
  mutable?: boolean;
}) {
  const [store, setStore] = useAtom(dbStore);
  const db = useFileDatabase(store, (u) => setStore((s) => ({ ...s, ...u })), {
    mutable,
  });
  const { records, commands } = store;

  const getRandomKey = () => {
    const deleted = new Set(
      records
        .filter((record) => record.value === "null")
        .map((record) => record.key),
    );
    return pick(
      records.map((record) => record.key),
      deleted,
    );
  };

  const addRecord = () => {
    const key = records.length + 1;
    db.set(
      randomUnique(
        0,
        20,
        records.map((record) => record.key),
      ),
      texts[(key - 1) % texts.length],
    );
  };

  const updateRecord = () => {
    const value = texts[random(0, texts.length - 1)];
    db.set(getRandomKey(), value);
  };

  const deleteRecord = () => {
    db.delete(getRandomKey());
  };

  return (
    <div className="space-y-3">
      <Controls
        mode={mode}
        isEmpty={db.size() === 0}
        on={(mode) => {
          switch (mode) {
            case "add":
              addRecord();
              break;
            case "update":
              updateRecord();
              break;
            case "delete":
              deleteRecord();
              break;
            case "search":
              db.get(getRandomKey());
              break;
            case "reset":
              setStore(initialStore);
              break;
          }
        }}
      />
      <CommandList commands={commands} />
    </div>
  );
}

const commandArgs = (command: DatabaseCommand) => {
  switch (command.type) {
    case "set":
      return `${command.key} "${command.value}"`;
    case "get":
    case "delete":
      return `${command.key}`;
  }
};

const MAX_VISIBLE_COMMANDS = 4;

function CommandList({ commands }: { commands: DatabaseCommand[] }) {
  const ref = useRef<HTMLOListElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTo({
        top: ref.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [commands]);

  return (
    <div
      className="rounded-lg bg-gray3 ring-1 shadow ring-neutral-950/15"
      style={{
        height: (MAX_VISIBLE_COMMANDS - 1) * 24 + 20 + 42,
      }}
    >
      <ol
        ref={ref}
        className="p-5 font-mono text-sm space-y-1 h-full overflow-y-auto"
        style={{
          maskImage: "linear-gradient(to bottom, transparent, black 30px)",
        }}
      >
        {commands.map((command, index) => (
          <motion.li
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            key={index}
            animate={{ y: 0, opacity: 1 }}
            initial={{ y: 20, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 30,
              damping: 4.1,
              mass: 0.2,
            }}
          >
            {command.type === "result" ? (
              <span className="ml-4">{command.value}</span>
            ) : (
              <>
                <span>$ db </span>
                <span className="font-medium text-blue11">{command.type}</span>
                <span>{` ${commandArgs(command)}`}</span>
              </>
            )}
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

function Controls({
  mode = "all",
  on,
  isEmpty,
}: {
  mode?: "all" | Mode[];
  on: (mode: Mode | "reset") => void;
  isEmpty: boolean;
}) {
  const showButton = (type: Mode) => {
    if (mode === "all") return true;
    return mode.includes(type);
  };
  return (
    <div className="flex gap-2">
      {showButton("add") && (
        <ToggleButton onClick={() => on("add")}>Add</ToggleButton>
      )}
      {showButton("update") && (
        <ToggleButton onClick={() => on("update")} disabled={isEmpty}>
          Update
        </ToggleButton>
      )}
      {showButton("delete") && (
        <ToggleButton onClick={() => on("delete")} disabled={isEmpty}>
          Delete
        </ToggleButton>
      )}
      {showButton("search") && (
        <ToggleButton onClick={() => on("search")} disabled={isEmpty}>
          Search
        </ToggleButton>
      )}
      <ResetButton onClick={() => on("reset")} />
    </div>
  );
}

export function FileDatabaseVisualizer() {
  const store = useAtomValue(dbStore);
  return (
    <div className="bg-gray4 border border-borderStrong rounded-xl h-[max(30vh,400px)] overflow-hidden relative">
      <p className="absolute top-3 left-4 text-gray11 font-mono text-sm">
        db.txt
      </p>
      <FileDatabase
        className="mt-16"
        records={store.records.map(({ key, value, id }, index) => {
          let type: "active" | "success" | "base" = "base";
          if (
            store.searchState.type !== "idle" &&
            store.searchState.context?.currentIndex === index
          ) {
            type = store.searchArgs.key === key ? "success" : "active";
          }
          return {
            value: { key, value },
            type,
            id,
          };
        })}
      />
      <motion.div
        className="absolute bg-gray4 h-[50px] left-0 right-0 bottom-0 border-t border-gray8 font-mono text-sm text-gray11 flex items-center justify-center"
        initial={{ y: "100%" }}
        animate={{ y: store.searchArgs ? 0 : "100%" }}
        transition={{ type: "spring", damping: 20 }}
      >
        {store.searchState.type === "found" ? (
          <FoundMessage
            keyName={store.searchArgs.key}
            value={store.records[store.searchState.context.currentIndex]?.value}
            type={store.searchArgs.mode}
          />
        ) : store.searchArgs ? (
          <span>
            Searching for key <strong>{store.searchArgs.key}</strong>...
          </span>
        ) : null}
      </motion.div>
    </div>
  );
}

const FoundMessage = ({
  keyName,
  value,
  type,
}: {
  keyName: number;
  value: string;
  type: "get" | "update" | "delete";
}) => {
  if (type === "get") {
    return (
      <span>
        Found key <strong>{keyName}</strong> with value "<em>{value}</em>"
      </span>
    );
  }
  if (type === "update") {
    return (
      <span>
        Updated key <strong>{keyName}</strong> to "<em>{value}</em>"
      </span>
    );
  }
  return (
    <span>
      Deleted key <strong>{keyName}</strong>
    </span>
  );
};
