import { FullWidth } from "~/components/FullWidth";
import { Visualizer, Content } from "~/components/Visualizer";
import { FileDatabase, FileDatabaseWrapper } from "../FileDatabase";

export const FileDatabaseExample = ({ records, fullWidth = false }) => {
  const Wrapper = fullWidth ? FullWidth : "figure";
  return (
    <Wrapper>
      <Visualizer>
        <FileDatabaseWrapper as={Content} padding="lg" noOverflow>
          <FileDatabase records={records} />
        </FileDatabaseWrapper>
      </Visualizer>
    </Wrapper>
  );
};
