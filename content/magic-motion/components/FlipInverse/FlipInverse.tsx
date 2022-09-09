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
  const scale = distance > 0 ? x / distance : 0;

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
          <Content>
            <svg width="100%" height="100%">
              <Initial ref={initialRef} x="1" />
              <Final ref={finalRef} x="100%" />
              <AnchorLine
                x1="61"
                x2="calc(100% - 61px)"
                y1="50%"
                y2="50%"
                style={{
                  transform: `scaleX(${Math.abs(scale)})`,
                  transformOrigin: "calc(100% - 61px)",
                }}
              />
              <AnchorCircle animate={{ rotate: x }} />
              <Element
                x="100%"
                animate={{ translateX: -121 + x }}
                style={{ translateY: -60 }}
              />
            </svg>
          </Content>
        </GridBackground>
      </FigureWrapper>
    </FullWidth>
  );
};

const Content = styled(ContentWrapper, {
  height: 300,
});

const AnchorCircle = styled(motion.circle, {
  cx: "calc(100% - 60px)",
  cy: "50%",
  fill: "$gray5",
  stroke: "$gray8",
  strokeWidth: 2,
  strokeDasharray: "12 2",
  r: 10,
});

const AnchorLine = styled("line", {
  stroke: "$gray8",
  strokeWidth: 2,
});

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
