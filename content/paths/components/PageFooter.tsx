import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { styled } from "~/stitches.config";
import { motion } from "framer-motion";
import { IconButton } from "~/components/Visualizer";
import { usePageContext } from "./PageProvider";

export const PageFooter = () => {
  const { next, prev } = usePageContext();
  return (
    <Footer>
      <IconButton onClick={prev}>
        <FaArrowLeft />
      </IconButton>
      <IconButton onClick={next}>
        <FaArrowRight />
      </IconButton>
    </Footer>
  );
};

const Footer = styled("footer", {
  display: "flex",
  justifyContent: "flex-end",
  gap: "$1",
  marginTop: "$8",
  marginBottom: 0,
  position: "absolute",
  bottom: "$8",
  right: "$8",
});
