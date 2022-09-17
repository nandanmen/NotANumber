import React from "react";
import { motion } from "framer-motion";

import { GridBackground } from "~/components/Grid";
import { FullWidth } from "~/components/FullWidth";
import { Slider } from "~/components/Slider";
import { styled } from "~/stitches.config";

import { ContentWrapper } from "../shared";

const PADDING = 45;
const SQUARE_RADIUS = 60;

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
          <Content>
            <svg width="100%" height="100%">
              <Square ref={initialRef} x={PADDING} />
              <Square
                ref={finalRef}
                x={`calc(100% - ${SQUARE_RADIUS * 2 + PADDING}px)`}
              />
              <AnchorLine
                x1={(SQUARE_RADIUS + PADDING) * 2 + x + distance}
                x2="100%"
                y1="50%"
                y2="50%"
                style={{ transform: `translateX(-${SQUARE_RADIUS + PADDING}px)` }}
              />
              <AnchorCircle
                animate={{ rotate: x, translateX: -(SQUARE_RADIUS + PADDING) }}
              />
              <Element
                x={`calc(100% - ${PADDING}px)`}
                animate={{ translateX: -(SQUARE_RADIUS * 2) + x }}
                initial={{ translateX: -(SQUARE_RADIUS * 2) + x }}
              />
              <TranslateText
                animate={{ translateX: -(SQUARE_RADIUS * 2 + PADDING) + x }}
                initial={{ translateX: -(SQUARE_RADIUS * 2 + PADDING) + x }}
                style={{ translateY: SQUARE_RADIUS + 25 }}
                x="100%"
                y="50%"
              >
                translateX({x.toFixed(0)}px)
              </TranslateText>
            </svg>
          </Content>
        </GridBackground>
      </FigureWrapper>
    </FullWidth>
  );
};

const TranslateText = styled(motion.text, {
  fontFamily: "$mono",
  fontSize: "$sm",
});

const Content = styled(ContentWrapper, {
  height: 300,
  paddingLeft: `0 !important`,
  paddingRight: `0 !important`,
});

const AnchorCircle = styled(motion.circle, {
  cx: "100%",
  cy: "50%",
  fill: "$gray5",
  stroke: "$gray8",
  strokeWidth: 2,
  strokeDasharray: "12 2",
  r: "10px",
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
  rx: "6px",
  y: `calc(50% - ${SQUARE_RADIUS}px)`,
});

const Element = styled(Square, {
  fill: "$blue5",
  stroke: "$blue7",
});
