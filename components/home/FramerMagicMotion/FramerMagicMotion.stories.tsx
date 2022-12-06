import { styled } from "~/stitches.config";
import { FramerMagicMotion } from "./FramerMagicMotion";

export const Default = () => (
  <Wrapper>
    <FramerMagicMotion />
  </Wrapper>
);

const Wrapper = styled("div", {
  width: 400,
  aspectRatio: 1,
});
