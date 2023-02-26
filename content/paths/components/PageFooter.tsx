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
  width: "100%",
  display: "flex",
  alignItems: "center",
  position: "absolute",
  bottom: "0",
  padding: "$8 $12",
  borderTop: "1px dashed $gray8",
});
