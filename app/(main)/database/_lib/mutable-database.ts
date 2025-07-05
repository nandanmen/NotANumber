import { nanoid } from "nanoid";

type DatabaseRecord = {
  key: number;
  value: string;
  id: string;
};

export type ExecutableDatabaseCommand =
  | {
      type: "set";
      key: number;
      value: string;
    }
  | { type: "delete"; key: number }
  | { type: "get"; key: number };

export const runGenerator = <T, R>(generator: Generator<T, R, unknown>) => {
  const result = generator.next();
  if (result.done) return result.value;
  return runGenerator(generator);
};

export class MutableDatabase {
  records: DatabaseRecord[] = [];

  constructor(initialRecords: (DatabaseRecord & { id?: string })[]) {
    this.records = initialRecords.map((record) => ({
      ...record,
      id: record.id ?? nanoid(),
    }));
  }

  static fromCommands(commands: ExecutableDatabaseCommand[]) {
    let db = new MutableDatabase([]);
    for (const command of commands) {
      switch (command.type) {
        case "set": {
          const result = runGenerator(db.set(command.key, command.value));
          db = result.db;
          break;
        }
        case "delete": {
          const result = runGenerator(db.delete(command.key));
          db = result.db;
          break;
        }
        default:
          break;
      }
    }
    return db;
  }

  *set(key: number, value: string) {
    for (const record of this.records) {
      yield record;
      if (record.key === key) {
        record.value = value;
        return record;
      }
    }
    const newRecord = { key, value, id: nanoid() };
    return {
      db: new MutableDatabase([...this.records, newRecord]),
      newRecord,
    };
  }

  *get(key: number) {
    for (const record of this.records) {
      yield record;
      if (record.key === key) return record;
    }
    return null;
  }

  *delete(key: number) {
    for (const record of this.records) {
      yield record;
      if (record.key === key) {
        return {
          db: new MutableDatabase(
            this.records.filter((record) => record.id !== record.id),
          ),
          deletedRecord: record,
        };
      }
    }
    return null;
  }
}
