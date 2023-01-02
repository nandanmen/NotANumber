import React from "react";
import { styled } from "~/stitches.config";

const getCurrentIndex = () => {
  if (typeof window === "undefined") return 0;
  const url = new URL(window.location.href).searchParams.get("index");
  return Number(url);
};

export const PageSection = ({ index, children }) => {
  const [visible, setVisible] = React.useState(false);
  const activeIndex = getCurrentIndex();

  React.useEffect(() => {
    setVisible(activeIndex >= index);
  }, [index, activeIndex]);

  return (
    <Section inactive={activeIndex !== index} hidden={!visible}>
      {children}
    </Section>
  );
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
    margin: "$8 -$8",
    marginTop: "$10",
    borderStyle: "dashed",
    borderColor: "$gray8",
  },

  pre: {
    marginLeft: "-$8",
    marginRight: "-$8",
    background: "$gray4",
    padding: "$4 $8",
    lineHeight: 1.4,
  },

  "code:not(pre code)": {
    background: "$gray6",
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
