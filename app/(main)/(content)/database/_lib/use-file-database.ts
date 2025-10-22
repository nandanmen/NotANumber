import useInterval from "@use-it/interval";
import { useRef } from "react";
import { nanoid } from "nanoid";

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

type SearchAction =
  | { type: "start" }
  | { type: "found"; index: number }
  | { type: "not-found" }
  | { type: "continue" }
  | { type: "reset" };

type SearchState =
  | {
      type: "idle";
      context: null;
    }
  | {
      type: "searching" | "found";
      context: {
        currentIndex: number;
      };
    }
  | {
      type: "not-found";
      context: null;
    };

export type DatabaseState = {
  commands: DatabaseCommand[];
  records: (DatabaseRecord & { id: string })[];
  searchArgs: SearchArgs | null;
  searchState: SearchState;
  options: { mutable: boolean };
};

export type FileDatabase = ReturnType<typeof useFileDatabase>;

export const useFileDatabase = (
  { commands, records, searchArgs, searchState }: DatabaseState,
  onChange: (state: Partial<DatabaseState>) => void,
  { mutable = false }: DatabaseProps = {},
) => {
  const matchesRef = useRef<number[]>([]);

  const send = (action: SearchAction) => {
    switch (action.type) {
      case "reset":
        onChange({ searchState: { type: "idle", context: null } });
        break;
      case "start":
        onChange({
          searchState: { type: "searching", context: { currentIndex: 0 } },
        });
        break;
      case "continue":
        if (searchState.type !== "searching") return;
        onChange({
          searchState: {
            type: "searching",
            context: {
              currentIndex: searchState.context.currentIndex + 1,
            },
          },
        });
        break;
      case "found":
        {
          if (searchState.type !== "searching") return;
          onChange({
            searchState: {
              type: "found",
              context: {
                ...searchState.context,
                currentIndex: action.index,
              },
            },
          });

          const { key, value } = records[action.index];
          switch (searchArgs.mode) {
            case "get":
              onChange({ commands: [...commands, { type: "result", value }] });
              break;
            case "update": {
              onChange({
                records: records.map((record) =>
                  record.key === key
                    ? {
                        key,
                        value: searchArgs.newValue,
                        id: record.id,
                      }
                    : record,
                ),
              });
              break;
            }
            case "delete":
              onChange({
                records: records.filter((record) => record.key !== key),
              });
              break;
          }
        }
        break;
      case "not-found":
        if (searchState.type !== "searching") return;
        onChange({ searchState: { type: "not-found", context: null } });
        break;
    }
  };

  const { type, context } = searchState;

  useInterval(
    () => {
      if (type !== "searching") return;
      if (!searchArgs) {
        console.error("searchArgs is null", {
          commands,
          records,
          searchArgs,
          searchState,
        });
        return send({ type: "reset" });
      }
      const currentRecord = records[context.currentIndex];

      /**
       * When mutable, we return as soon as we find the first occurrence of the
       * key.
       */
      if (mutable) {
        if (!currentRecord) return send({ type: "not-found" });
        if (currentRecord.key === searchArgs.key) {
          return send({ type: "found", index: context.currentIndex });
        }
        return send({ type: "continue" });
      }

      /**
       * Otherwise, we look for the _last_ occurrence of the key.
       */
      if (currentRecord?.key === searchArgs.key) {
        matchesRef.current.push(context.currentIndex);
        return send({ type: "continue" });
      }

      if (!currentRecord) {
        if (matchesRef.current.length < 1) {
          return send({ type: "not-found" });
        }
        const index = matchesRef.current.at(-1);
        matchesRef.current = [];
        return send({ type: "found", index });
      }

      send({ type: "continue" });
    },
    type === "searching" ? 500 : null,
  );

  const resetSearch = () => {
    onChange({ searchArgs: null });
    send({ type: "reset" });
  };

  const db = {
    size() {
      const valuesUnique = {};
      for (const record of records) {
        valuesUnique[record.key] = record.value;
      }
      return new Set(
        Object.entries(valuesUnique)
          .filter((record) => record[1] !== "null")
          .map((record) => record[0]),
      ).size;
    },
    set(key: number, value: string) {
      resetSearch();
      onChange({
        commands: [...commands, { type: "set", key, value }],
        records: [...records, { key, value, id: nanoid() }],
      });
    },
    update(key: number, value: string) {
      if (!mutable) return db.set(key, value);
      onChange({
        commands: [...commands, { type: "set", key, value }],
        searchArgs: { key, mode: "update", newValue: value },
      });
      send({ type: "start" });
    },
    get(key: number) {
      onChange({
        commands: [...commands, { type: "get", key }],
        searchArgs: { key, mode: "get" },
      });
      send({ type: "start" });
    },
    delete(key: number) {
      onChange({ commands: [...commands, { type: "delete", key }] });
      if (!mutable) {
        resetSearch();
        onChange({
          records: [...records, { key, value: "null", id: nanoid() }],
        });
        return;
      }
      onChange({ searchArgs: { key, mode: "delete" } });
      send({ type: "start" });
    },
  };

  return db;
};
