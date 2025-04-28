import type { DatabaseRecord } from "./database";

const ipsum =
  "dolor sit amet, consectetur adipiscing elit. Vestibulum varius vel mauris iaculis pharetra.".split(
    " "
  );

export const texts: string[] = [];

for (let i = 0; i < ipsum.length; i += 2) {
  texts.push(`${ipsum[i]} ${ipsum[i + 1]}`);
}

// get a random number within bounds
export const random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const randomUnique = (min: number, max: number, exclude: number[]) => {
  let number = random(min, max);
  let retries = 0;
  while (exclude.includes(number)) {
    number = random(min, max);
    retries++;

    if (retries >= max - min) {
      throw new Error("Unable to find unique number");
    }
  }
  return number;
};

export const createRandomRecords = (len: number): DatabaseRecord[] => {
  const keys = [];
  const records: DatabaseRecord[] = [];
  for (let i = 0; i < len; i++) {
    const record = createRandomRecord(keys);
    keys.push(record[0]);
    records.push(record);
  }
  return records;
};

export const createRandomRecord = (
  existingKeys: number[] = []
): DatabaseRecord => {
  const key = randomUnique(1, 999, existingKeys);
  return [key, texts[random(0, texts.length - 1)]];
};

export function pick<DataType>(
  array: DataType[],
  exclude: Set<DataType>
): DataType {
  let item = array[random(0, array.length - 1)];
  while (exclude.has(item)) {
    item = array[random(0, array.length - 1)];
  }
  return item;
}
