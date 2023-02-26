import { motion } from "framer-motion";
import React from "react";
import { styled } from "~/stitches.config";
import { usePageContext } from "../PageProvider";

export const PageSection = ({ index, children }) => {
  const ref = React.useRef<HTMLElement>(null);
  const { activeIndex } = usePageContext();
  const hidden = activeIndex < index;

  React.useEffect(() => {
    if (!hidden) {
      window.scrollTo({
        top: ref.current.offsetTop,
      });
    }
  }, [hidden]);

  if (hidden) return null;
  return (
    <Section
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", damping: 20 }}
    >
      {children}
    </Section>
  );
};

const Section = styled(motion.section, {
  lineHeight: "$body",
  padding: "$12",

  "&:not(:last-of-type)": {
    borderBottom: "1px dashed $gray8",
  },

  "> *:not(:last-child)": {
    marginBottom: "1em",
  },

  "h1,h2,h3": {
    lineHeight: "$title",
  },

  h1: {
    fontSize: "$2xl",
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

  textarea: {
    display: "block",
    width: "100%",
    resize: "none",
    border: "1px solid $gray8",
    borderRadius: "$base",
    padding: "$4",
    minHeight: 300,
    fontFamily: "$mono",
    fontSize: "inherit",
    background: "$gray3",
  },

  "code:not(pre code)": {
    background: "$gray3",
    padding: "0 $1",
    borderRadius: 4,
  },
});
