"use client";

import { motion } from "framer-motion";
import { random, randomUnique, texts, pick } from "./utils";
import { ResetButton, ToggleButton } from "./toggle-button";
import { FileDatabase as FileDatabaseComponent } from "./file-database";
import {
  type DatabaseState,
  useFileDatabase,
  type DatabaseCommand,
  type FileDatabase,
} from "../_lib/use-file-database";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { useScrollGroupState } from "~/components/mdx/scroll-group";
import { cn } from "~/lib/cn";

type Mode = "add" | "update" | "delete" | "search";

export function getFileDatabaseControls({
  store,
  db,
}: {
  store: DatabaseState;
  db: FileDatabase;
}) {
  const { records } = store;
  const getRandomKey = () => {
    const deleted = new Set(
      records
        .filter((record) => record.value === "null")
        .map((record) => record.key)
    );
    return pick(
      records.map((record) => record.key),
      deleted
    );
  };
  return {
    add: () => {
      const key = records.length + 1;
      db.set(
        randomUnique(
          0,
          20,
          records.map((record) => record.key)
        ),
        texts[(key - 1) % texts.length]
      );
    },
    update: () => {
      const value = texts[random(0, texts.length - 1)];
      if (store.options.mutable) {
        db.update(getRandomKey(), value);
      } else {
        db.set(getRandomKey(), value);
      }
    },
    delete: () => {
      db.delete(getRandomKey());
    },
    search: () => {
      db.get(getRandomKey());
    },
  };
}

export function FileDatabaseControls({ mode }: { mode?: Mode[] }) {
  const [store, setStore] = useScrollGroupState<DatabaseState>();
  const [initialStore] = useState(store);

  const db = useFileDatabase(store, (u) => setStore((s) => ({ ...s, ...u })), {
    mutable: store.options.mutable,
  });
  const controls = getFileDatabaseControls({ store, db });

  return (
    <div className="space-y-3">
      {mode.length > 0 && (
        <Controls
          mode={mode}
          isEmpty={db.size() === 0}
          on={(mode) => {
            switch (mode) {
              case "add":
                controls.add();
                break;
              case "update":
                controls.update();
                break;
              case "delete":
                controls.delete();
                break;
              case "search":
                controls.search();
                break;
              case "reset":
                setStore(initialStore);
                break;
            }
          }}
        />
      )}
      <CommandList showAll={mode.length === 0} commands={store.commands} />
    </div>
  );
}

type RenderableCommand = DatabaseCommand | { type: "add"; key: number };

const commandArgs = (command: RenderableCommand) => {
  switch (command.type) {
    case "set":
      return `${command.key} "${command.value}"`;
    case "get":
    case "add":
    case "delete":
      return `${command.key}`;
  }
};

const MAX_VISIBLE_COMMANDS = 4;

export function CommandList({
  prefix = "db",
  className,
  commands,
  showAll = false,
  empty,
}: {
  prefix?: string;
  className?: string;
  commands: RenderableCommand[];
  empty?: ReactNode;
  showAll?: boolean;
}) {
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
      className={cn(
        "rounded-lg bg-gray3 ring-1 shadow ring-neutral-950/15 relative",
        className
      )}
      style={{
        height: showAll ? "auto" : (MAX_VISIBLE_COMMANDS - 1) * 24 + 20 + 42,
      }}
    >
      <ol
        ref={ref}
        className="p-5 font-mono text-sm space-y-1 h-full overflow-y-auto"
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
                <span>$ {prefix} </span>
                <span className="font-medium text-blue11">{command.type}</span>
                <span>{` ${commandArgs(command)}`}</span>
              </>
            )}
          </motion.li>
        ))}
        {empty && commands.length === 0 && <>{empty}</>}
      </ol>
      <div
        className="absolute h-10 top-0 left-0 right-0 rounded-t-lg bg-gray3 pointer-events-none"
        style={{
          maskImage: `linear-gradient(
  to bottom,
  hsl(0, 0%, 0%) 0%,
  hsla(0, 0%, 0%, 0.987) 8.1%,
  hsla(0, 0%, 0%, 0.951) 15.5%,
  hsla(0, 0%, 0%, 0.896) 22.5%,
  hsla(0, 0%, 0%, 0.825) 29%,
  hsla(0, 0%, 0%, 0.741) 35.3%,
  hsla(0, 0%, 0%, 0.648) 41.2%,
  hsla(0, 0%, 0%, 0.55) 47.1%,
  hsla(0, 0%, 0%, 0.45) 52.9%,
  hsla(0, 0%, 0%, 0.352) 58.8%,
  hsla(0, 0%, 0%, 0.259) 64.7%,
  hsla(0, 0%, 0%, 0.175) 71%,
  hsla(0, 0%, 0%, 0.104) 77.5%,
  hsla(0, 0%, 0%, 0.049) 84.5%,
  hsla(0, 0%, 0%, 0.013) 91.9%,
  hsla(0, 0%, 0%, 0) 100%
)`,
        }}
      />
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

export const toFileDatabaseRecords = (store: DatabaseState) => {
  return store.records.map(({ key, value, id }, index) => {
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
  });
};

export function FileDatabaseVisualizer() {
  const [store] = useScrollGroupState<DatabaseState>();
  return (
    <div className="bg-gray5 lg:bg-gray4 shadow-inner lg:shadow-none border-y -mx-6 md:border-x lg:mx-0 border-borderStrong md:rounded-xl h-[350px] lg:h-[max(30vh,400px)] overflow-hidden relative px-6">
      <p className="text-gray11 font-mono text-sm my-3">db.txt</p>
      <FileDatabaseComponent
        className="md:max-w-[300px] mx-auto"
        records={toFileDatabaseRecords(store)}
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
