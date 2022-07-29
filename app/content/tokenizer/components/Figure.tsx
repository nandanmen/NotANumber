import { styled } from "../../../stitches.config";

export const Figure = styled("figure", {
  gridColumn: "1 / -1",
});

export const Caption = styled("p", {
  padding: "$0 $8",
  marginTop: "$4",
  fontSize: "$sm",
  textAlign: "center",
});
