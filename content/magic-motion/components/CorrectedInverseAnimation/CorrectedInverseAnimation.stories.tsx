import { SharedState } from "~/components/SharedState";
import { CorrectedInverseAnimation } from "./CorrectedInverseAnimation";

export const Default = () => <CorrectedInverseAnimation />;

export const Corrected = () => <CorrectedInverseAnimation corrected />;

export const Shared = () => {
  return (
    <SharedState initialState={170}>
      <CorrectedInverseAnimation />
      <CorrectedInverseAnimation corrected />
    </SharedState>
  );
};
