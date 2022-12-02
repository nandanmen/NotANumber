import { Content } from "../Visualizer";
import { styled } from "~/stitches.config";

export const VisualWrapper = ({ children }) => {
  return (
    <Wrapper>
      <Background />
      {children}
    </Wrapper>
  );
};

const Background = styled(Content, {
  position: "absolute",
  inset: 0,
  borderRadius: 9999,
  border: "1px solid $gray8",
});

const Wrapper = styled("div", {
  height: "100%",
  position: "relative",
});
