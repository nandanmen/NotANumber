import React from "react";
import { motion, animate, useMotionValue } from "framer-motion";
import { FaUndo } from "react-icons/fa";

import { GridBackground } from "~/components/Grid";
import { FullWidth } from "~/components/FullWidth";
import { styled } from "~/stitches.config";

import { ContentWrapper, ToggleButton, Controls } from "../shared";

const PADDING = 45;
const SQUARE_RADIUS = 60;

export const SizePlayAnimation = () => {
  const [width, setWidth] = React.useState(SQUARE_RADIUS * 2);

  const svgRef = React.useRef<SVGSVGElement>();
  const finalRef = React.useRef<SVGRectElement>();

  React.useEffect(() => {
    const { width } = svgRef.current.getBoundingClientRect();
    setWidth(width - PADDING * 2);
  }, []);

  const scale = useMotionValue(1);
  const lineRef = React.useRef<SVGLineElement>();
  const textRef = React.useRef<SVGTextElement>();

  const updateRefs = React.useCallback(
    (value: number) => {
      finalRef.current?.setAttribute("width", (value * width).toString());
      lineRef.current?.setAttribute("x2", (value * width - 2).toString());
      textRef.current?.setAttribute("x", ((width * value) / 2).toString());
      if (textRef.current) {
        textRef.current.textContent = `scale(${value.toFixed(2)})`;
      }
    },
    [scale, width]
  );

  React.useEffect(() => {
    const scaleDiff = 120 / width;
    scale.set(scaleDiff);
    updateRefs(scaleDiff);
  }, [width, scale, updateRefs]);

  React.useEffect(() => {
    return scale.onChange(updateRefs);
  }, [updateRefs]);

  return (
    <FullWidth>
      <FigureWrapper>
        <Controls>
          <ToggleButton onClick={() => animate(scale, 1, { duration: 3 })}>
            Play
          </ToggleButton>
          <UndoButton onClick={() => scale.set(120 / width)}>
            <FaUndo />
          </UndoButton>
        </Controls>
        <GridBackground>
          <Content>
            <svg ref={svgRef} width="100%" height="100%">
              <OriginalSquareWrapper width={width}>
                <OriginalSquare />
              </OriginalSquareWrapper>
              <Square ref={finalRef} x={PADDING} />
              <motion.g
                style={{ x: PADDING, y: `calc(50% - ${SQUARE_RADIUS}px)` }}
              >
                <AnchorLine ref={lineRef} x1="2" y1="2" y2="118" />
                <TranslateText ref={textRef} y={64} textAnchor="middle" />
              </motion.g>
            </svg>
          </Content>
        </GridBackground>
      </FigureWrapper>
    </FullWidth>
  );
};

const UndoButton = styled(ToggleButton, {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "$gray10",
  height: 22,
});

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
});

const Square = styled(motion.rect, {
  height: 120,
  rx: "6px",
  y: `calc(50% - ${SQUARE_RADIUS}px)`,
  filter: "drop-shadow(var(--shadows-sm))",
  fill: "$blue5",
  stroke: "$blue7",
});
