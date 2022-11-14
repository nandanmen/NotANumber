import React from "react";
import { motion } from "framer-motion";

import { FullWidth } from "~/components/FullWidth";
import { Visualizer, Content } from "~/components/Visualizer";
import { styled } from "~/stitches.config";

export const SizeDistanceInverseSnapshot = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const initialRef = React.useRef<HTMLDivElement>(null);
  const finalRef = React.useRef<HTMLDivElement>(null);

  const [transform, setTransform] = React.useState({
    x: 0,
    y: 0,
    scaleY: 1,
    scaleX: 1,
  });

  React.useEffect(() => {
    const transform = invert({
      from: finalRef.current?.getBoundingClientRect(),
      to: initialRef.current?.getBoundingClientRect(),
    });
    setTransform(transform);
  }, []);

  return (
    <FullWidth>
      <Visualizer>
        <ContentWrapper ref={containerRef}>
          <Square ref={initialRef} secondary striped />
          <Square ref={finalRef} large striped />
          <Square
            large
            css={{ position: "absolute", right: "$8" }}
            style={transform}
          />
        </ContentWrapper>
      </Visualizer>
    </FullWidth>
  );
};

function invert({ from, to }) {
  const { x: fromX, y: fromY, width: fromWidth, height: fromHeight } = from;
  const { x, y, width, height } = to;

  return {
    x: x - fromX,
    y: y - fromY,
    scaleX: width / fromWidth,
    scaleY: height / fromHeight,
  };
}

const ContentWrapper = styled(Content, {
  height: 300,
  padding: "$8",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

const Square = styled(motion.div, {
  "--background": "$colors$blue6",

  background: `var(--background)`,
  border: "1px solid $blue8",
  width: 120,
  aspectRatio: 1,
  borderRadius: "$base",
  boxShadow: "$sm",

  variants: {
    large: {
      true: {
        width: 200,
      },
    },
    secondary: {
      true: {
        "--background": "$colors$gray6",
        border: "1px solid $gray7",
        boxShadow: "none",
      },
    },
    striped: {
      true: {
        background: `repeating-linear-gradient(-45deg, var(--background), var(--background) 5px, transparent 5px, transparent 10px)`,
        boxShadow: "none",
      },
    },
  },
});
