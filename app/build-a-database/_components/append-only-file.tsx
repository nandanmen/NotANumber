"use client";

import { motion } from "framer-motion";
import { random, randomUnique, texts, pick } from "./utils";
import {
  useFileDatabase,
  type ExecutableDatabaseCommand,
  type DatabaseCommand,
} from "./database";
import { FileDatabase } from "./file-database";
import { ResetButton, ToggleButton } from "./toggle-button";

type Mode = "add" | "update" | "delete" | "search";

type AppendOnlyFileProps = {
  mode?: "all" | Mode[];
  initialCommands?: Array<ExecutableDatabaseCommand>;
  mutable?: boolean;
};

const defaultCommands: ExecutableDatabaseCommand[] = [
  { type: "set", key: 1, value: "Lorem ipsum" },
  { type: "set", key: 18, value: "dolor sit" },
];

export function AppendOnlyFile({
  mode,
  mutable = false,
  initialCommands = defaultCommands,
}: AppendOnlyFileProps) {
  const db = useFileDatabase({ initialCommands, mutable });
  const { args, context, type } = db.search;

  const getRandomKey = () => {
    const deleted = new Set(
      db.records
        .filter((record) => record.value === "null")
        .map((record) => record.key)
    );
    return pick(
      db.records.map((record) => record.key),
      deleted
    );
  };

  const addRecord = () => {
    const key = db.records.length + 1;
    db.set(
      randomUnique(
        0,
        20,
        db.records.map((record) => record.key)
      ),
      texts[(key - 1) % texts.length]
    );
  };

  const updateRecord = () => {
    const value = texts[random(0, texts.length - 1)];
    db.update(getRandomKey(), value);
  };

  const deleteRecord = () => {
    db.delete(getRandomKey());
  };

  return (
    <div className="!col-span-2 space-y-4">
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
              db.reset();
              break;
          }
        }}
      />
      <div className="grid grid-cols-[320px_1fr] border border-gray8 w-2/3 divide-x h-[400px] divide-gray8 rounded-lg overflow-hidden">
        <CommandList commands={db.commands} />
        <div className="bg-gray5 rounded-r-lg pt-10 flex justify-center relative">
          <FileDatabase
            records={db.records.map(({ key, value, id }, index) => {
              let type: "active" | "success" | "base" = "base";
              if (
                db.search.type !== "idle" &&
                context?.currentIndex === index
              ) {
                type = args.key === key ? "success" : "active";
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
            animate={{ y: args ? 0 : "100%" }}
            transition={{ type: "spring", damping: 20 }}
          >
            {type === "found" ? (
              <FoundMessage
                keyName={args.key}
                value={db.records[context.currentIndex]?.value}
                type={args.mode}
              />
            ) : args ? (
              <span>
                Searching for key <strong>{args.key}</strong>...
              </span>
            ) : null}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ---

const commandArgs = (command: DatabaseCommand) => {
  switch (command.type) {
    case "set":
      return `${command.key} "${command.value}"`;
    case "get":
    case "delete":
      return `${command.key}`;
  }
};

function CommandList({ commands }: { commands: DatabaseCommand[] }) {
  return (
    <ol className="p-5 font-mono text-sm rounded-l-lg bg-gray3 space-y-1">
      {commands.map((command, index) => (
        <motion.li
          key={index}
          animate={{ y: 0, opacity: 1 }}
          initial={{ y: 20, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
        >
          {command.type === "result" ? (
            <span className="ml-4">{command.value}</span>
          ) : (
            <>
              <span>{`$ db `}</span>
              <span className="font-medium text-blue11">{command.type}</span>
              <span>{` ${commandArgs(command)}`}</span>
            </>
          )}
        </motion.li>
      ))}
    </ol>
  );
}

// --

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

// ---

function Controls({
  mode,
  on,
  isEmpty,
}: {
  mode?: "all" | Mode[];
  on: (mode: Mode | "reset") => void;
  isEmpty: boolean;
}) {
  const showButton = (type: Mode) => {
    if (!mode || mode === "all") return true;
    return mode.includes(type);
  };
  return (
    <div className="flex gap-1">
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
