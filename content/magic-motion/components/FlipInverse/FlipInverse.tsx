import React from "react";
import { motion } from "framer-motion";

import { GridBackground } from "~/components/Grid";
import { FullWidth } from "~/components/FullWidth";
import { Slider } from "~/components/Slider";
import { styled } from "~/stitches.config";

import { Tooltip, ContentWrapper, XLine, YLine } from "../shared";

export const FlipInverse = () => {
  const [x, setX] = React.useState(0);

  const initialRef = React.useRef<SVGRectElement>();
  const finalRef = React.useRef<SVGRectElement>();

  const [initialBox, setInitialBox] = React.useState(null);
  const [finalBox, setFinalBox] = React.useState(null);

  React.useEffect(() => {
    setInitialBox(initialRef.current.getBoundingClientRect());
    setFinalBox(finalRef.current.getBoundingClientRect());
  }, []);

  const distance = (finalBox?.x ?? 0) - (initialBox?.x ?? 0);

  return (
    <FullWidth>
      <FigureWrapper>
        <Slider
          value={[x]}
          onValueChange={([x]) => setX(x)}
          max={0}
          min={-1 * distance}
        />
        <GridBackground>
          <ContentWrapper>
            <svg width="100%" height="100%">
              <Initial ref={initialRef} x="1" />
              <Final ref={finalRef} x="100%" />
              <Element
                x="100%"
                animate={{ translateX: -121 + x }}
                style={{ translateY: -60 }}
              />
            </svg>
          </ContentWrapper>
        </GridBackground>
      </FigureWrapper>
    </FullWidth>
  );
};

const FigureWrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$8",
});

const Square = styled(motion.rect, {
  width: 120,
  height: 120,
  fill: "$gray5",
  stroke: "$gray8",
  rx: 6,
  y: "50%",
});

const Initial = styled(Square, {
  transform: "translateY(-60px)",
});

const Final = styled(Square, {
  transform: "translate(-121px, -60px)",
});

const Element = styled(Square, {
  fill: "$blue5",
  stroke: "$blue7",
});
