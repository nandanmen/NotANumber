import {
  InverseScaleFormula,
  InverseScaleFormulaSandbox,
} from "./InverseScaleFormula";

export const Default = () => (
  <InverseScaleFormula scale={1} corrected={false} />
);

export const Sandbox = () => <InverseScaleFormulaSandbox />;
