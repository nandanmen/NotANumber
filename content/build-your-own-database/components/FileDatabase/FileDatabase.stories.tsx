import { type DatabaseRecord } from "../AppendOnlyFile/database";
import { FileDatabase } from "./FileDatabase";

const records: Array<{
  value: DatabaseRecord;
  type?: "success" | "active" | "base";
}> = [
  {
    value: [3, "Lorem ipsum"],
  },
  {
    value: [1, "Lorem ipsum"],
    type: "success",
  },
  {
    value: [18, "Lorem ipsum"],
    type: "active",
  },
];

export const Default = () => <FileDatabase records={records} />;
