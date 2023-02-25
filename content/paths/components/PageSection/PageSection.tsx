import React from "react";
import { styled } from "~/stitches.config";
import { usePageContext } from "../PageProvider";

export const PageSection = ({ index, children }) => {
  const { activeIndex } = usePageContext();
  return <Section hidden={activeIndex < index}>{children}</Section>;
};

const Section = styled("section", {
  lineHeight: "$body",

  "> *": {
    marginBottom: "1em",
  },

  h1: {
    fontSize: "$xl",
    fontWeight: 800,
  },

  hr: {
    margin: "$8 -$12",
    marginTop: "$10",
    borderStyle: "dashed",
    borderColor: "$gray8",
  },

  pre: {
    background: "$gray3",
    borderRadius: "$base",
    border: "1px solid $gray8",
    padding: "$4",
    lineHeight: 1.4,
  },

  "code:not(pre code)": {
    background: "$gray3",
    padding: "0 $1",
    borderRadius: 4,
  },

  variants: {
    inactive: {
      true: {
        color: "$gray10",
      },
    },
    hidden: {
      true: {
        display: "none",
      },
    },
  },
});
