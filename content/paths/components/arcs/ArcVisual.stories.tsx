import { PageProvider } from "../PageProvider";
import { ArcsVisual } from ".";

export const Default = () => {
  return (
    <PageProvider page="arcs" numSections={Number.POSITIVE_INFINITY}>
      <div style={{ width: 1100, position: "relative" }}>
        <ArcsVisual />
      </div>
    </PageProvider>
  );
};
