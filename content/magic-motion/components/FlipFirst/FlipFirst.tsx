import React from "react";
import { motion } from "framer-motion";

import { GridBackground } from "~/components/Grid";
import { FullWidth } from "~/components/FullWidth";
import { styled } from "~/stitches.config";

const SQUARE_WIDTH = 120;

export const FlipFirst = () => {
  const [box, setBox] = React.useState<{ x: number; y: number } | null>(null);
  const [hovering, setHovering] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>();

  const measure = () => {
    const el = buttonRef.current;
    if (el) {
      const { x, y } = el.getBoundingClientRect();
      setBox({ x, y });
    }
  };

  const active = Boolean(box);

  return (
    <FullWidth>
      <GridBackground>
        <ContentWrapper>
          {(hovering || active) && (
            <>
              <XLine active={active} />
              <YLine active={active} />
            </>
          )}
          <Square
            ref={buttonRef}
            onClick={measure}
            onHoverStart={() => setHovering(true)}
            onHoverEnd={() => setHovering(false)}
            whileTap={{ scale: 0.95 }}
            active={active}
          >
            Click me!
          </Square>
          {active && (
            <Box initial={{ x: -4, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
              <p>x: {box.x.toFixed(1)}</p>
              <p>y: {box.y.toFixed(1)}</p>
            </Box>
          )}
        </ContentWrapper>
      </GridBackground>
    </FullWidth>
  );
};

const Box = styled(motion.div, {
  position: "relative",
  padding: "$4",
  fontFamily: "$mono",
  background: "$gray2",
  borderRadius: "$base",
  border: "1px solid $gray9",
  boxShadow: "$md",

  "&:after": {
    content: "",
    width: 10,
    aspectRatio: 1,
    background: "inherit",
    position: "absolute",
    border: "inherit",
    borderTop: "none",
    borderRight: "none",
    left: -6,
    top: "calc(50% - 5px)",
    transform: "rotate(45deg)",
  },
});

const ContentWrapper = styled("div", {
  position: "relative",
  padding: "$12",
  display: "flex",
  alignItems: "center",
  gap: "$4",
});

const XLine = styled(motion.div, {
  position: "absolute",
  borderBottom: "1px dashed $gray10",
  width: "100%",
  left: 0,
  top: "50%",

  variants: {
    active: {
      true: {
        borderColor: "$blue10",
      },
    },
  },
});

const YLine = styled(motion.div, {
  position: "absolute",
  borderLeft: "1px dashed $gray10",
  height: "100%",
  top: 0,
  transform: `translateX(${SQUARE_WIDTH / 2}px)`,

  variants: {
    active: {
      true: {
        borderColor: "$blue10",
      },
    },
  },
});

const Square = styled(motion.button, {
  position: "relative",
  width: SQUARE_WIDTH,
  aspectRatio: 1,
  background: "$blue5",
  borderRadius: "$base",
  border: "1px solid $blue7",
  textAlign: "center",
  color: "$blue11",

  "&:hover": {
    borderColor: "$blue10",
  },

  variants: {
    active: {
      true: {
        borderColor: "$blue10",
      },
    },
  },
});
