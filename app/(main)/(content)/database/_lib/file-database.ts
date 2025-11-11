import { nanoid } from "nanoid";
import type {
  DatabaseCommand,
  DatabaseRecord,
  DatabaseState,
} from "./use-file-database";

export const createStore = (
  commands: DatabaseCommand[],
  options: DatabaseState["options"] = { mutable: false },
): DatabaseState => {
  const records = populateRecordsFromCommands(commands);
  return {
    commands,
    records,
    searchArgs: null,
    searchState: { type: "idle", context: null },
    options,
  };
};

const populateRecordsFromCommands = (commands: DatabaseCommand[]) => {
  const records: (DatabaseRecord & { id: string })[] = [];
  for (const command of commands) {
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
};
