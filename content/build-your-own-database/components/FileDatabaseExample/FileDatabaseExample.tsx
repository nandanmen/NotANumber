import { Visualizer, Content } from "~/components/Visualizer";
import { FileDatabase, FileDatabaseWrapper } from "../FileDatabase";

export const FileDatabaseExample = ({ records, fullWidth = false }) => {
  return (
    <Visualizer fullWidth={fullWidth}>
      <FileDatabaseWrapper as={Content} padding="lg" noOverflow>
        <FileDatabase records={records} />
      </FileDatabaseWrapper>
    </Visualizer>
  );
};
