import { styled } from "~/stitches.config";
import { GridBackground } from "../Grid";

export const Visualizer = styled("div", {
  border: "1px solid $gray8",
  borderRadius: "$base",
  overflow: "hidden",

  "> :nth-child(2)": {
    borderTop: "1px solid $gray8",
  },
});

export const Controls = styled("div", {
  background: "$gray5",
  position: "relative",
  padding: "$2",
  display: "flex",
  justifyContent: "space-between",
});

export const Content = styled(GridBackground, {
  border: "none",
  borderRadius: 0,

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
