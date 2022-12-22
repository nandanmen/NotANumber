import snapshot from "~/lib/algorithm/snapshot.macro";

export const compact = snapshot((records) => {
  const compactedRecords = [];

  for (let i = records.length - 1; i >= 0; i--) {
    const { value: record } = records[i];
    const [key] = record;

    // skip this record if we've already seen a record with the same key
    if (compactedRecords.some(({ value: _record }) => _record[0] === key)) {
      debugger;
      continue;
    }

    debugger;
    compactedRecords.unshift({ value: record });
  }

  debugger;
  return compactedRecords;
});
