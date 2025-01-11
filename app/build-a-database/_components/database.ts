import useInterval from "@use-it/interval";
import { useState } from "react";
import { nanoid } from "nanoid";
import { useSearch } from "./use-search";

export type DatabaseRecord = {
  key: number;
  value: string;
};

export type DatabaseCommand =
  | {
      type: "get" | "delete";
      key: number;
    }
  | {
      type: "set";
      key: number;
      value: string;
    }
  | {
      type: "result";
      value: string;
    }
  | {
      type: "error";
      value: string;
    };

type DatabaseProps = {
  initialRecords?: Omit<DatabaseRecord, "id">[];
  initialCommands?: DatabaseCommand[];
};

type SearchArgs =
  | {
      key: number;
      mode: "get" | "delete";
    }
  | {
      key: number;
      mode: "update";
      newValue: string;
    };

export const useFileDatabase = ({
  initialRecords = [],
  initialCommands = [],
}: DatabaseProps = {}) => {
  const [commands, setCommands] = useState(initialCommands);

  const [initialRecordsWithIds] = useState(
    initialRecords.map((r) => ({ ...r, id: nanoid() }))
  );
  const [records, setRecords] = useState<(DatabaseRecord & { id: string })[]>(
    initialRecordsWithIds
  );

  const [searchArgs, setSearchArgs] = useState<SearchArgs | null>(null);
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
      if (!currentRecord) return send("not-found");
      const { key } = currentRecord;
      if (key === searchArgs.key) {
        return send("found");
      }
      send("continue");
    },
    type === "searching" ? 500 : null
  );

  const resetSearch = () => {
    setSearchArgs(null);
    send("reset");
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
    update(key: number, value: string, { mutate = false } = {}) {
      if (!mutate) return db.set(key, value);
      setCommands([...commands, { type: "set", key, value }]);
      setSearchArgs({ key, mode: "update", newValue: value });
      send("start");
    },
    get(key: number) {
      setCommands([...commands, { type: "get", key }]);
      setSearchArgs({ key, mode: "get" });
      send("start");
    },
    delete(key: number, { mutate = false } = {}) {
      setCommands([...commands, { type: "delete", key }]);
      if (!mutate) {
        resetSearch();
        setRecords([...records, { key, value: "null", id: nanoid() }]);
        return;
      }
      setSearchArgs({ key, mode: "delete" });
      send("start");
    },
    reset() {
      resetSearch();
      setRecords(initialRecordsWithIds);
      setCommands(initialCommands);
    },
  };

  return db;
};
