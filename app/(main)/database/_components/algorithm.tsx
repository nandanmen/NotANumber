/* import { exec } from "~/lib/algorithm";
import { parseAlgorithm } from "~/lib/parse-algorithm"; */
import { RangeQueryClient } from "./range-query/client";

/* const unsorted = `${(() =>
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
  })()}`; */

const randomArrayOfNumbers = [7, 3, 9, 1, 4, 8, 11];
const sortedArrayOfNumbers = [...randomArrayOfNumbers].sort((a, b) => a - b);

const sortedResults = [
  {
    item: 1,
    i: 0,
    arr: [1, 3, 4, 7, 8, 9, 11],
    start: 2,
    end: 6,
    items: [],
    message: "1 is below lower bound, skipping...",
    line: 8,
  },
  {
    item: 3,
    i: 1,
    arr: [1, 3, 4, 7, 8, 9, 11],
    start: 2,
    end: 6,
    items: [],
    message: "3 is within bounds, adding...",
    line: 17,
  },
  {
    item: 4,
    i: 2,
    arr: [1, 3, 4, 7, 8, 9, 11],
    start: 2,
    end: 6,
    items: [3],
    message: "4 is within bounds, adding...",
    line: 17,
  },
  {
    item: 7,
    i: 3,
    arr: [1, 3, 4, 7, 8, 9, 11],
    start: 2,
    end: 6,
    items: [3, 4],
    message: "7 is above upper bound, stopping...",
    line: 13,
  },
  {
    arr: [1, 3, 4, 7, 8, 9, 11],
    start: 2,
    end: 6,
    items: [3, 4],
    message: "Done! Found 2 items within bounds.",
    line: 21,
    __done: true,
    __returnValue: [3, 4],
  },
];

const unsortedResults = [
  {
    item: 7,
    i: 0,
    arr: [7, 3, 9, 1, 4, 8, 11],
    start: 2,
    end: 6,
    items: [],
    message: "7 is out of bounds, skipping...",
    line: 12,
  },
  {
    item: 3,
    i: 1,
    arr: [7, 3, 9, 1, 4, 8, 11],
    start: 2,
    end: 6,
    items: [],
    message: "3 is within bounds, adding...",
    line: 8,
  },
  {
    item: 9,
    i: 2,
    arr: [7, 3, 9, 1, 4, 8, 11],
    start: 2,
    end: 6,
    items: [3],
    message: "9 is out of bounds, skipping...",
    line: 12,
  },
  {
    item: 1,
    i: 3,
    arr: [7, 3, 9, 1, 4, 8, 11],
    start: 2,
    end: 6,
    items: [3],
    message: "1 is out of bounds, skipping...",
    line: 12,
  },
  {
    item: 4,
    i: 4,
    arr: [7, 3, 9, 1, 4, 8, 11],
    start: 2,
    end: 6,
    items: [3],
    message: "4 is within bounds, adding...",
    line: 8,
  },
  {
    item: 8,
    i: 5,
    arr: [7, 3, 9, 1, 4, 8, 11],
    start: 2,
    end: 6,
    items: [3, 4],
    message: "8 is out of bounds, skipping...",
    line: 12,
  },
  {
    item: 11,
    i: 6,
    arr: [7, 3, 9, 1, 4, 8, 11],
    start: 2,
    end: 6,
    items: [3, 4],
    message: "11 is out of bounds, skipping...",
    line: 12,
  },
  {
    arr: [7, 3, 9, 1, 4, 8, 11],
    start: 2,
    end: 6,
    items: [3, 4],
    message: "Done! Found 2 items within bounds.",
    line: 16,
    __done: true,
    __returnValue: [3, 4],
  },
];

export function Algorithm() {
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
