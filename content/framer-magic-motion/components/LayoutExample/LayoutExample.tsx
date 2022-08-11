import React from "react";
import { motion } from "framer-motion";

import { GridOverflowBox } from "~/components/Grid";
import { styled } from "~/stitches.config";

export const LayoutExample = () => {
  const [open, toggle] = React.useReducer((state) => !state, false);

  return (
    <GridOverflowBox>
      <Wrapper>
        <motion.div>
          <button onClick={toggle}>Hello!</button>
          {open && <p>I'm more content!</p>}
        </motion.div>
        <motion.p layout>Hello!</motion.p>
      </Wrapper>
    </GridOverflowBox>
  );
};

const Wrapper = styled("div", {
  width: 300,
});
