import snapshot from "~/lib/algorithm/snapshot.macro";
import type { Record } from "../FileDatabase";

export type CompactState = {
  compactedRecords: Record[];
  records: Record[][];
  segmentIndex: number;
  offset: number;
  record: Record;
  key: string;
};

export const compact = snapshot((records: Record[][]) => {
  const compactedRecords = [];

  for (
    let segmentIndex = records.length - 1;
    segmentIndex >= 0;
    segmentIndex--
  ) {
    const segment = records[segmentIndex];
    for (let offset = segment.length - 1; offset >= 0; offset--) {
      const { value: record } = segment[offset];
      const [key] = record;

      // skip this record if we've already seen a record with the same key
      if (compactedRecords.some(({ value: _record }) => _record[0] === key)) {
        debugger;
        continue;
      }

      debugger;
      compactedRecords.unshift({ value: record });
    }
  }

  debugger;
  debugger;
  return compactedRecords;
});
