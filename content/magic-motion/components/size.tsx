import { motion } from "framer-motion";

import { styled } from "~/stitches.config";
import { Square } from "./shared";

export const SizeExample = ({ toggled }) => {
  return (
    <>
      <FakeBorder
        layout
        transition={{ duration: 1 }}
        toggled={toggled}
        style={{ borderRadius: 7 }}
      />
      <DisplayOnlySquare
        layout
        transition={{ duration: 1 }}
        toggled={toggled}
        style={{ borderRadius: 6 }}
      />
    </>
  );
};

const FakeBorder = styled(motion.div, {
  position: "absolute",
  left: `calc($space$12 - 1px)`,
  background: "$blue7",
  width: 122,
  height: 122,

  variants: {
    toggled: {
      true: {
        width: "calc(100% - $space$12 * 2 + 2px)",
      },
    },
  },
});

const DisplayOnlySquare = styled(Square, {
  position: "relative",
  pointerEvents: "none",
  border: "none",
  height: 120,

  variants: {
    toggled: {
      true: {
        width: "100%",
        aspectRatio: "auto",
      },
    },
  },
});
