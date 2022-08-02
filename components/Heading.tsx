import React from "react";
import { styled } from "~/stitches.config";

export const Heading = ({ children }) => {
  const id = getIdFromChildren(children);
  return <H2 id={id}>{children}</H2>;
};

export const getIdFromChildren = (children: React.ReactNode) => {
  if (typeof children === "string") {
    return children.toLowerCase().replace(/\s/g, "-").replace(/\.|\?/g, "");
  }
};

const H2 = styled("h2", {
  fontSize: "$2xl",
  fontFamily: "$serif",
  position: "relative",
  scrollMarginTop: "$28",
  marginTop: "$24",
  marginBottom: "$8",

  "&:before": {
    content: "",
    position: "absolute",
    left: 0,
    top: "-$4",
    width: "$6",
    height: 3,
    background: "currentColor",
  },
});

export const Subheading = ({ children }) => {
  const id = getIdFromChildren(children);
  return <H3 id={id}>{children}</H3>;
};

const H3 = styled("h3", {
  fontSize: "$xl",
  scrollMarginTop: "$28",
  marginTop: "$8",
  marginBottom: "$6",
  fontWeight: "normal",
});
