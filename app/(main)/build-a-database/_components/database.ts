import useInterval from "@use-it/interval";
import { useRef, useState } from "react";
import { nanoid } from "nanoid";
import { useSearch } from "./use-search";

export type DatabaseRecord = {
  key: number;
  value: string;
};

export type ExecutableDatabaseCommand =
  | {
      type: "get" | "delete";
      key: number;
    }
  | {
      type: "set";
      key: number;
      value: string;
    };

export type DatabaseCommand =
  | ExecutableDatabaseCommand
  | {
      type: "result";
      value: string;
    }
  | {
      type: "error";
      value: string;
    };

type DatabaseProps = {
  initialCommands?: ExecutableDatabaseCommand[];
  mutable?: boolean;
};

type SearchArgs =
  | {
      key: number;
      mode: "get" | "delete";
      last?: boolean;
    }
  | {
      key: number;
      mode: "update";
      newValue: string;
      last?: boolean;
    };

export const useFileDatabase = ({
  initialCommands = [],
  mutable = false,
}: DatabaseProps = {}) => {
  const [commands, setCommands] = useState<DatabaseCommand[]>(initialCommands);
  const [initialRecordsWithIds] = useState(() => {
    const records: (DatabaseRecord & { id: string })[] = [];
    for (const command of initialCommands) {
      switch (command.type) {
        case "set":
          records.push({
            key: command.key,
            value: command.value,
            id: nanoid(),
          });
          break;
        case "delete":
          records.push({
            key: command.key,
            value: "null",
            id: nanoid(),
          });
          break;
        default:
          break;
      }
    }
    return records;
  });
  const [records, setRecords] = useState(initialRecordsWithIds);
  const [searchArgs, setSearchArgs] = useState<SearchArgs | null>(null);
  const matchesRef = useRef<number[]>([]);
  const { state, send } = useSearch({
    onFound: (index) => {
      const { key, value } = records[index];
      switch (searchArgs.mode) {
        case "get":
          setCommands((c) => [...c, { type: "result", value }]);
          break;
        case "update": {
          setRecords((r) =>
            r.map((record) =>
              record.key === key
                ? {
                    key,
                    value: searchArgs.newValue,
                    id: record.id,
                  }
                : record
            )
          );
          break;
        }
        case "delete":
          setRecords((r) => r.filter((record) => record.key !== key));
          break;
      }
    },
  });
  const { type, context } = state;

  useInterval(
    () => {
      if (type !== "searching") return;
      const currentRecord = records[context.currentIndex];
      if (!mutable) {
        if (!currentRecord) {
          if (matchesRef.current.length < 1) {
            return send({ type: "not-found" });
          } else {
            const index = matchesRef.current.at(-1);
            matchesRef.current = [];
            return send({ type: "found", index });
          }
        } else if (currentRecord.key === searchArgs.key) {
          matchesRef.current.push(context.currentIndex);
        }
      } else {
        if (!currentRecord) return send({ type: "not-found" });
        if (currentRecord.key === searchArgs.key) {
          return send({ type: "found", index: context.currentIndex });
        }
      }
      send({ type: "continue" });
    },
    type === "searching" ? 500 : null
  );

  const resetSearch = () => {
    setSearchArgs(null);
    send({ type: "reset" });
  };

  const db = {
    records,
    commands,
    search: {
      ...state,
      args: searchArgs,
    },
    size() {
      const valuesUnique = {};
      records.forEach((record) => {
        valuesUnique[record[0]] = record[1];
      });
      return new Set(
        Object.entries(valuesUnique)
          .filter((record) => record[1] !== "null")
          .map((record) => record[0])
      ).size;
    },
    set(key: number, value: string) {
      resetSearch();
      setCommands([...commands, { type: "set", key, value }]);
      setRecords([...records, { key, value, id: nanoid() }]);
    },
    update(key: number, value: string) {
      if (!mutable) return db.set(key, value);
      setCommands([...commands, { type: "set", key, value }]);
      setSearchArgs({ key, mode: "update", newValue: value });
      send({ type: "start" });
    },
    get(key: number) {
      setCommands([...commands, { type: "get", key }]);
      setSearchArgs({ key, mode: "get" });
      send({ type: "start" });
    },
    delete(key: number) {
      setCommands([...commands, { type: "delete", key }]);
      if (!mutable) {
        resetSearch();
        setRecords([...records, { key, value: "null", id: nanoid() }]);
        return;
      }
      setSearchArgs({ key, mode: "delete" });
      send({ type: "start" });
    },
    reset() {
      resetSearch();
      setRecords(initialRecordsWithIds);
      setCommands(initialCommands);
    },
  };

  return db;
};
