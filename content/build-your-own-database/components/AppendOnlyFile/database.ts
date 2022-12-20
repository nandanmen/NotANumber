import React from "react";
import useInterval from "@use-it/interval";

export type DatabaseRecord = [number, string];

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

export type SearchState = {
  key: number | null;
  currentIndex: number | null;
};

export const useFileDatabase = (initialRecords: DatabaseRecord[] = []) => {
  const [commands, setCommands] = React.useState([]);
  const [records, setRecords] = React.useState(initialRecords);
  const [searchSpeed, setSearchSpeed] = React.useState(null);
  const [{ key, currentIndex }, setSearch] = React.useState<SearchState>({
    key: null,
    currentIndex: null,
  });

  const currentRecord = records[currentIndex];
  const found = currentRecord && currentRecord[0] === key;

  useInterval(() => {
    const currentRecord = records[currentIndex];
    // Either we found the key or we're out of bounds
    if (!currentRecord || found) {
      setSearchSpeed(null);
      if (found) {
        setCommands([...commands, { type: "result", value: currentRecord[1] }]);
      }
    } else {
      setSearch({ key, currentIndex: currentIndex + 1 });
    }
  }, searchSpeed);

  const db = {
    records,
    commands,
    search: {
      key,
      currentIndex,
      found,
      speed: searchSpeed,
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
      setCommands([...commands, { type: "set", key, value }]);
      setRecords([...records, [key, value]]);
    },
    get(key: number) {
      setCommands([...commands, { type: "get", key }]);
      setSearch({ key, currentIndex: 0 });
      setSearchSpeed(500);
    },
    delete(key: number) {
      setCommands([...commands, { type: "delete", key }]);
      setRecords([...records, [key, "null"]]);
    },
  };

  return db;
};
