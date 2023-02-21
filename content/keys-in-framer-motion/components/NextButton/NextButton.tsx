import React from "react";
import { motion } from "framer-motion";
import { FullWidth } from "~/components/FullWidth";
import { Content, Visualizer } from "~/components/Visualizer";
import { styled } from "~/stitches.config";

export const Button = ({ toggled, onClick = () => {} }) => {
  return (
    <Box
      as={motion.button}
      layout
      onClick={onClick}
      css={{
        "--border-color": "$colors$gray8",

        background: "$gray1",
        border: "1px solid var(--border-color)",
        borderRadius: "$base",
        padding: "$2 $4",

        "&:hover": {
          "--border-color": "$colors$gray12",
        },

        "&:focus-visible": {
          outline: "2px solid var(--border-color)",
        },
      }}
    >
      <motion.span
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ delay: 0.2 }}
        key={String(toggled)}
      >
        {toggled ? "Next" : "Show Answer"}
      </motion.span>
    </Box>
  );
};

export const NextButton = () => {
  const [toggled, toggle] = React.useReducer((state) => !state, false);
  return (
    <FullWidth>
      <Visualizer>
        <Content
          css={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "$10",
          }}
        >
          <Button toggled={toggle} onClick={toggle} />
        </Content>
      </Visualizer>
    </FullWidth>
  );
};

const Box = styled("div", {});
