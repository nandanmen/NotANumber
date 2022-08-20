import { FullWidth } from "../FullWidth";
import { Sandbox } from "./Sandbox";

export const Default = () => <Sandbox />;

export const Wide = () => (
  <FullWidth>
    <Sandbox mode="horizontal" showConsole />
  </FullWidth>
);
