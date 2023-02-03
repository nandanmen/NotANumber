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
  inset: "$6",
  borderRadius: 9999,
  border: "1px solid $gray8",

  "@lg": {
    display: "none",
  },
});

const Wrapper = styled("div", {
  width: "100%",
  position: "relative",
  maxWidth: 600,
});
