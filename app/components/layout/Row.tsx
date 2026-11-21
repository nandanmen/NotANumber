import { motion } from "framer-motion";
import { styled } from "~/stitches.config";

export const Row = styled(motion.div, {
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
