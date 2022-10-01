import React from "react";
import { motion } from "framer-motion";

import { GridBackground } from "~/components/Grid";
import { FullWidth } from "~/components/FullWidth";
import { Slider } from "~/components/Slider";
import { styled } from "~/stitches.config";

import { ContentWrapper } from "../shared";

const PADDING = 45;
const SQUARE_RADIUS = 60;

export const InverseSizeSlider = () => {
  const [scale, setScale] = React.useState(1);
  const [width, setWidth] = React.useState(SQUARE_RADIUS * 2);

  const svgRef = React.useRef<SVGSVGElement>();
  const finalRef = React.useRef<SVGRectElement>();

  const [finalBox, setFinalBox] = React.useState(null);

  React.useEffect(() => {
    const { width } = svgRef.current.getBoundingClientRect();
    setWidth(width - PADDING * 2);
  }, []);

  React.useEffect(() => {
    if (width > SQUARE_RADIUS * 2) {
      setFinalBox(finalRef.current.getBoundingClientRect());
    }
  }, [width]);

  const scaleDiff = 120 / (finalBox?.width ?? 120);

  return (
    <FullWidth>
      <FigureWrapper>
        <Slider
          value={[scale]}
          onValueChange={([scale]) => setScale(scale)}
          max={1}
          min={scaleDiff}
          step={0.01}
        />
        <GridBackground>
          <Content>
            <svg ref={svgRef} width="100%" height="100%">
              <OriginalSquareWrapper width={width}>
                <OriginalSquare />
              </OriginalSquareWrapper>
              <Square ref={finalRef} x={PADDING} width={width * scale} />
              <motion.g
                style={{ x: PADDING, y: `calc(50% - ${SQUARE_RADIUS}px)` }}
              >
                <AnchorLine x1="2" x2={width * scale - 2} y1="2" y2="118" />
                <TranslateText
                  x={(width * scale) / 2}
                  y={64}
                  textAnchor="middle"
                >
                  scale({scale.toFixed(2)})
                </TranslateText>
              </motion.g>
            </svg>
          </Content>
        </GridBackground>
      </FigureWrapper>
    </FullWidth>
  );
};

const OriginalSquareWrapper = styled("foreignObject", {
  height: 120,
  rx: "6px",
  y: `calc(50% - ${SQUARE_RADIUS}px)`,
  filter: "drop-shadow(var(--shadows-sm))",
  x: PADDING,
});

const OriginalSquare = styled("div", {
  background: `repeating-linear-gradient( -45deg, $colors$gray8, $colors$gray8 5px, transparent 5px, transparent 10px )`,
  border: "1px solid $gray8",
  height: 120,
  width: "100%",
  borderRadius: "$base",
});

const TranslateText = styled(motion.text, {
  fontFamily: "$mono",
  fontSize: "$sm",
  fill: "$blue11",
});

const Content = styled(ContentWrapper, {
  height: 300,
  paddingLeft: `0 !important`,
  paddingRight: `0 !important`,
});

const AnchorLine = styled("line", {
  stroke: "$blue7",
  strokeWidth: 1,
  strokeDasharray: "6",
});

const FigureWrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$8",
});

const Square = styled(motion.rect, {
  height: 120,
  rx: "6px",
  y: `calc(50% - ${SQUARE_RADIUS}px)`,
  filter: "drop-shadow(var(--shadows-sm))",
  fill: "$blue5",
  stroke: "$blue7",
});
