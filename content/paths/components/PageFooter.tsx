import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { styled } from "~/stitches.config";
import { motion } from "framer-motion";
import { IconButton } from "~/components/Visualizer";
import { usePageContext } from "./PageProvider";

export const PageFooter = () => {
  const { next, prev, numSections, activeIndex } = usePageContext();
  return (
    <Footer>
      <Box as="p" css={{ fontFamily: "$mono", color: "$gray11" }}>
        {activeIndex + 1} / {numSections}
      </Box>
      <Box css={{ display: "flex", gap: "$1", marginLeft: "auto" }}>
        <IconButton onClick={prev}>
          <FaArrowLeft />
        </IconButton>
        <IconButton onClick={next}>
          <FaArrowRight />
        </IconButton>
      </Box>
    </Footer>
  );
};

const Box = styled("div", {});

const Footer = styled("footer", {
  fontSize: 16,
  width: "calc(68ch - 1px)",
  display: "flex",
  alignItems: "center",
  position: "fixed",
  bottom: 0,
  padding: "$6 $12",
  background: "hsla(0, 0%, 93.0%, 0.6)",
  backdropFilter: "blur(4px)",
  borderTop: "1px solid $gray8",
});
