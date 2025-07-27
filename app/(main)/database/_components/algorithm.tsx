import { exec } from "~/lib/algorithm";
import { parseAlgorithm } from "~/lib/parse-algorithm";
import { RangeQueryClient } from "./range-query/client";

const unsorted = `${(() =>
  function findInRange(arr, start, end) {
    const items = [];
    let message = "";
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i];
      if (item > start && item < end) {
        message = `${item} is within bounds, adding...`;
        debugger;
        items.push(item);
      } else {
        message = `${item} is out of bounds, skipping...`;
        debugger;
      }
    }
    message = `Done! Found ${items.length} items within bounds.`;
    debugger;
    return items;
  })()}`;

const sorted = `${(() =>
  function findInRange(arr, start, end) {
    const items = [];
    let message = "";
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i];
      if (item <= start) {
        message = `${item} is below lower bound, skipping...`;
        debugger;
        continue;
      }
      if (item >= end) {
        message = `${item} is above upper bound, stopping...`;
        debugger;
        break;
      }
      message = `${item} is within bounds, adding...`;
      debugger;
      items.push(item);
    }
    message = `Done! Found ${items.length} items within bounds.`;
    debugger;
    return items;
  })()}`;

const randomArrayOfNumbers = [7, 3, 9, 1, 4, 8, 11];
const sortedArrayOfNumbers = [...randomArrayOfNumbers].sort((a, b) => a - b);

const run = (code, inputs) => {
  const { entryPoint } = eval(parseAlgorithm(code));
  return exec(entryPoint, inputs);
};

export function Algorithm() {
  const unsortedResults = run(unsorted, [randomArrayOfNumbers, 2, 6]);
  const sortedResults = run(sorted, [sortedArrayOfNumbers, 2, 6]);
  return (
    <RangeQueryClient
      inputs={{
        sorted: sortedArrayOfNumbers,
        unsorted: randomArrayOfNumbers,
      }}
      snapshots={{
        sorted: sortedResults as Array<{
          items: number[];
          i: number;
          message: string;
        }>,
        unsorted: unsortedResults as Array<{
          items: number[];
          i: number;
          message: string;
        }>,
      }}
    />
  );
}
