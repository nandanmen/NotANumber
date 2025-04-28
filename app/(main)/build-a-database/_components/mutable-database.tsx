"use client";

import { atom, useAtom, useAtomValue } from "jotai";
import { motion } from "framer-motion";
import { random, randomUnique, texts, pick } from "./utils";
import {
  MutableDatabase,
  runGenerator,
  type ExecutableDatabaseCommand,
} from "../_lib/mutable-database";
import { ResetButton, ToggleButton } from "./toggle-button";
import { useState } from "react";

type DatabaseCommand =
  | ExecutableDatabaseCommand
  | { type: "result"; value: string };

const defaultCommands: ExecutableDatabaseCommand[] = [
  { type: "set", key: 1, value: "Lorem ipsum" },
  { type: "set", key: 18, value: "dolor sit" },
];

const dbAtom = atom(MutableDatabase.fromCommands(defaultCommands));

type Mode = "add" | "update" | "delete" | "search";

export function MutableDatabaseControls({ mode }: { mode?: Mode[] }) {
  const [db, setDb] = useAtom(dbAtom);
  const [commands, setCommands] = useState<DatabaseCommand[]>(defaultCommands);

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
    const { db: newDb } = runGenerator(
      db.set(
        randomUnique(
          0,
          20,
          db.records.map((record) => record.key)
        ),
        texts[(key - 1) % texts.length]
      )
    );
    setDb(newDb);
  };

  const updateRecord = () => {
    const value = texts[random(0, texts.length - 1)];
    db.set(getRandomKey(), value);
  };

  const deleteRecord = () => {
    db.delete(getRandomKey());
  };

  return (
    <>
      <Controls
        mode={mode}
        isEmpty={db.records.length === 0}
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
              setDb(MutableDatabase.fromCommands(defaultCommands));
              break;
          }
        }}
      />
      <CommandList commands={commands} />
    </>
  );
}

const commandArgs = (command: ExecutableDatabaseCommand) => {
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
    <ol className="p-5 font-mono text-sm rounded-lg bg-gray3 border border-borderStrong space-y-1">
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

export function MutableDatabaseVisualizer() {
  const db = useAtomValue(dbAtom);
  return (
    <div>
      <h1>Mutable Database</h1>
      <pre>{JSON.stringify(db.records, null, 2)}</pre>
    </div>
  );
}
