import { styled } from "~/stitches.config";

export const SecondaryButton = styled("button", {
  width: "$8",
  height: "$8",
  borderRadius: 4,
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  color: "$gray11",
  background: "none",
  boxShadow: "none",
  border: "none",

  "&:hover": {
    color: "$gray11",
    background: "$gray7",
    border: "none",
  },
});
