import { type Record } from "../FileDatabase";
import { FileDatabaseExample } from "./FileDatabaseExample";

const records: Record[] = [
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

export const Default = () => <FileDatabaseExample records={records} />;

export const FullWidth = () => (
  <FileDatabaseExample records={records} fullWidth />
);
