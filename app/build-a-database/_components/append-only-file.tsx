"use client";

import { motion } from "framer-motion";
import { random, randomUnique, texts, pick } from "./utils";
import {
  useFileDatabase,
  type DatabaseRecord,
  type DatabaseCommand,
} from "./database";
import { FileDatabase } from "./file-database";

const commandArgs = (command: DatabaseCommand) => {
  switch (command.type) {
    case "set":
      return `${command.key} "${command.value}"`;
    case "get":
    case "delete":
      return `${command.key}`;
  }
};

type Mode = "add" | "update" | "delete" | "search";

type AppendOnlyFileProps = {
  mode?: "all" | Mode[];
  initialRecords?: Array<DatabaseRecord>;
  initialCommands?: Array<DatabaseCommand>;
};

const defaultData: DatabaseRecord[] = [
  [1, "Lorem ipsum"],
  [18, "dolor sit"],
];

function ToggleButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="bg-gray3 border border-gray8 flex items-center h-8 px-2.5 rounded-full text-sm font-medium text-gray11 hover:bg-gray4 disabled:opacity-60 disabled:hover:bg-gray3 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}

export function AppendOnlyFile({
  mode,
  initialRecords = defaultData,
  initialCommands = defaultData.map((data) => {
    return {
      type: "set",
      key: data[0],
      value: data[1],
    };
  }),
}: AppendOnlyFileProps) {
  const db = useFileDatabase({ initialRecords, initialCommands });
  const { key, currentIndex, found } = db.search;
  const currentRecord = db.records[currentIndex];

  const getRandomKey = () => {
    const deleted = new Set(
      db.records
        .filter((record) => record[1] === "null")
        .map((record) => record[0])
    );
    return pick(
      db.records.map((record) => record[0]),
      deleted
    );
  };

  const addRecord = () => {
    const key = db.records.length + 1;
    db.set(
      randomUnique(
        0,
        20,
        db.records.map((record) => record[0])
      ),
      texts[(key - 1) % texts.length]
    );
  };

  const updateRecord = () => {
    const value = texts[random(0, texts.length - 1)];
    db.set(getRandomKey(), value);
  };

  const deleteRecord = () => {
    db.delete(getRandomKey());
  };

  const showButton = (type: Mode) => {
    if (mode === "all") return true;
    if (Array.isArray(mode)) return mode.includes(type);
    return false;
  };

  return (
    <div className="!col-span-2 space-y-4">
      <div className="flex gap-1">
        {showButton("add") && (
          <ToggleButton onClick={addRecord}>Add</ToggleButton>
        )}
        {showButton("update") && (
          <ToggleButton onClick={updateRecord} disabled={db.size() === 0}>
            Update
          </ToggleButton>
        )}
        {showButton("delete") && (
          <ToggleButton onClick={deleteRecord} disabled={db.size() === 0}>
            Delete
          </ToggleButton>
        )}
        {showButton("search") && (
          <ToggleButton
            onClick={() => db.get(getRandomKey())}
            disabled={db.size() === 0}
          >
            Search
          </ToggleButton>
        )}
        <button
          className="h-8 w-8 rounded-full bg-gray3 flex items-center justify-center border border-gray8 hover:bg-gray4 text-gray11"
          onClick={() => db.reset()}
        >
          <span className="sr-only">Reset</span>
          <svg
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          >
            <path d="M11.25 4.75L8.75 7L11.25 9.25" />
            <path d="M12.75 19.25L15.25 17L12.75 14.75" />
            <path d="M9.75 7H13.25C16.5637 7 19.25 9.68629 19.25 13V13.25" />
            <path d="M14.25 17H10.75C7.43629 17 4.75 14.3137 4.75 11V10.75" />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-[320px_1fr] border border-gray8 w-2/3 divide-x h-[400px] divide-gray8 rounded-lg overflow-hidden">
        <ol className="p-5 font-mono text-sm rounded-l-lg bg-gray3 space-y-1">
          {db.commands.map((command, index) => (
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
                  <span className="font-medium text-blue11">
                    {command.type}
                  </span>
                  <span>{` ${commandArgs(command)}`}</span>
                </>
              )}
            </motion.li>
          ))}
        </ol>
        <div className="bg-gray5 rounded-r-lg pt-10 flex justify-center relative">
          <FileDatabase
            records={db.records.map(([dbKey, value], index) => {
              let type: "active" | "success" | "base" = "base";
              if (currentIndex === index) {
                type = key === dbKey ? "success" : "active";
              }
              return {
                value: [dbKey, value],
                type,
              };
            })}
          />
          <motion.div
            className="absolute bg-gray4 h-[50px] left-0 right-0 bottom-0 border-t border-gray8 font-mono text-sm text-gray11 flex items-center justify-center"
            initial={{ y: "100%" }}
            animate={{ y: key ? 0 : "100%" }}
            transition={{ type: "spring", damping: 20 }}
          >
            {found ? (
              <span>
                Found key <strong>{key}</strong> with value "
                <em>{currentRecord[1]}</em>"
              </span>
            ) : key ? (
              <span>
                Searching for key <strong>{key}</strong>...
              </span>
            ) : null}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
