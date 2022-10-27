import { motion } from "framer-motion";
import { styled } from "~/stitches.config";

export const PADDING = 45;
export const SQUARE_RADIUS = 60;

export const BaseSvgSquare = styled(motion.rect, {
  rx: "$radii$base",
  filter: "drop-shadow($shadows$sm)",
  fill: "$blue6",
  stroke: "$blue8",

  variants: {
    type: {
      secondary: {
        fill: "$gray6",
        stroke: "$gray8",
        filter: "none",
      },
    },
  },
});

export const SvgSquare = styled(BaseSvgSquare, {
  height: SQUARE_RADIUS * 2,
});
