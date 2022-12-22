import { AppendOnlyFile } from "./AppendOnlyFile";

export const Default = () => <AppendOnlyFile />;

export const WithMode = () => <AppendOnlyFile mode={["update", "search"]} />;

export const WithInitialData = () => (
  <AppendOnlyFile
    initialData={[
      [1, "Lorem ipsum"],
      [2, "dolor sit"],
    ]}
  />
);
