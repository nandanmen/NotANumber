import { motion } from "framer-motion";
import { styled } from "~/stitches.config";

export const PADDING = 45;
export const SQUARE_RADIUS = 60;

export const SvgSquare = styled(motion.rect, {
  height: SQUARE_RADIUS * 2,
  rx: "$radii$base",
  filter: "drop-shadow($shadows$sm)",
  fill: "$blue5",
  stroke: "$blue7",
});
