import React, { type ComponentPropsWithoutRef } from "react";
import { motion } from "framer-motion";

import { styled, darkTheme } from "~/stitches.config";

export const PADDING = 32;
export const SQUARE_RADIUS = 60;

const _BaseSvgSquare = styled(motion.rect, {
  filter: "drop-shadow($shadows$sm)",
  fill: "$blue6",
  stroke: "$blue8",

  [`.${darkTheme} &`]: {
    fill: "$blueDark8",
    stroke: "$blueDark10",
  },

  variants: {
    type: {
      secondary: {
        fill: "$gray6",
        stroke: "$gray8",
        filter: "none",

        [`.${darkTheme} &`]: {
          fill: "$gray4",
          stroke: "$gray6",
        },
      },
    },
  },
});

export const BaseSvgSquare = React.forwardRef<
  SVGRectElement,
  ComponentPropsWithoutRef<typeof _BaseSvgSquare>
>(function BaseSvgSquare(props, ref) {
  return <_BaseSvgSquare ref={ref} rx="6" {...props} />;
});

export const SvgSquare = styled(BaseSvgSquare, {
  height: SQUARE_RADIUS * 2,
});
