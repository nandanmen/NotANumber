import { styled } from "~/stitches.config";
import { GridBackground } from "../Grid";

export const Visualizer = styled("div", {
  border: "1px solid $gray8",
  borderRadius: "$base",
  overflow: "hidden",
});

export const Controls = styled("div", {
  borderTop: "1px solid $gray8",
  background: "$gray5",
  position: "relative",
  padding: "$2",
});

export const Content = styled(GridBackground, {
  border: "none",
  borderRadius: "none",

  variants: {
    padding: {
      sm: {
        padding: "$4",
      },
      md: {
        padding: "$6",
      },
      lg: {
        padding: "$8",
      },
    },
  },
});
