import { styled } from "~/stitches.config";

export const Row = styled("div", {
  display: "flex",

  variants: {
    center: {
      all: {
        alignItems: "center",
        justifyContent: "center",
      },
      vertical: {
        alignItems: "center",
      },
      horizontal: {
        justifyContent: "center",
      },
    },
  },
});
