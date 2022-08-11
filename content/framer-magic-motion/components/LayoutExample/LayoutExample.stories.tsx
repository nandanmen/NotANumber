import { FullWidth } from "~/components/FullWidth";
import { LayoutExample } from "./LayoutExample";

export const Default = () => <LayoutExample />;

export const WithFullWidth = () => (
  <FullWidth>
    <LayoutExample />
  </FullWidth>
);
