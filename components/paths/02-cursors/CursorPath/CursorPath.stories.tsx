import { styled } from "~/stitches.config";
import { CursorPath } from "./CursorPath";

export const Default = () => (
  <Wrapper>
    <CursorPath />
  </Wrapper>
);

const Wrapper = styled("div", {
  height: 700,
});
