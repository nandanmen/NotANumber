import React from "react";
import { motion } from "framer-motion";

import { GridBackground } from "~/components/Grid";
import { FullWidth } from "~/components/FullWidth";
import { styled } from "~/stitches.config";

const SQUARE_WIDTH = 120;

let key = 1;

export const FlipLast = () => {
  const [toggled, setToggled] = React.useState(false);
  const [box, setBox] = React.useState<{ x: number; y: number } | null>(null);
  const [firstBox, setFirstBox] = React.useState<{
    x: number;
    y: number;
  } | null>(null);
  const [hovering, setHovering] = React.useState(false);

  const originalRef = React.useRef<HTMLButtonElement>();
  const buttonRef = React.useRef<HTMLButtonElement>();

  const measure = () => {
    const el = buttonRef.current;
    if (el) {
      key++;
      const { x, y } = el.getBoundingClientRect();
      setBox({ x, y });
    }
  };

  const active = Boolean(box);

  React.useEffect(() => {
    const { x, y } = originalRef.current.getBoundingClientRect();
    setFirstBox({ x, y });
  }, []);

  return (
    <FullWidth>
      <div>
        <button onClick={() => setToggled(true)}>Toggle</button>
      </div>
      <GridBackground>
        <ContentWrapper toggled={toggled}>
          {(hovering || active) && (
            <>
              <XLine active={active} />
              <YLine active={active} />
            </>
          )}
          <Square ref={originalRef} outline css={{ left: "$12" }}>
            <PositionText>x: {firstBox?.x.toFixed(1)}</PositionText>
            <PositionText>y: {firstBox?.y.toFixed(1)}</PositionText>
          </Square>
          {active && (
            <Box
              initial={{ x: -4, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              key={key}
            >
              <p>x: {box.x.toFixed(1)}</p>
              <p>y: {box.y.toFixed(1)}</p>
            </Box>
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
    borderBottom: "none",
    borderLeft: "none",
    right: -6,
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

  variants: {
    toggled: {
      true: {
        justifyContent: "flex-end",
      },
    },
  },
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
  transform: `translateX(-${SQUARE_WIDTH / 2}px)`,

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
    outline: {
      true: {
        position: "absolute",
        pointerEvents: "none",
        background: "$gray5",
        borderStyle: "dashed",
        borderColor: "$gray8",
      },
    },
  },
});

const PositionText = styled("p", {
  color: "$gray11",
  fontFamily: "$mono",
});
