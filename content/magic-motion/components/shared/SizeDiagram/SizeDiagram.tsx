import React from "react";
import { motion, MotionValue } from "framer-motion";

import { styled } from "~/stitches.config";
import { SQUARE_RADIUS, PADDING, SvgSquare } from "../styles";

export type SizeDiagramProps = {
  scale: MotionValue<number>;
  onWidthChange?: (width: number) => void;
  padding?: number;
};

export const SizeDiagram = ({
  scale,
  onWidthChange,
  padding = PADDING,
}: SizeDiagramProps) => {
  const [width, setWidth] = React.useState(SQUARE_RADIUS * 2);

  const svgRef = React.useRef<SVGSVGElement>();
  const finalRef = React.useRef<SVGRectElement>();

  React.useEffect(() => {
    const { width } = svgRef.current.getBoundingClientRect();
    setWidth(width - padding * 2);
  }, [padding]);

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
    [width]
  );

  React.useEffect(() => {
    if (onWidthChange) {
      onWidthChange(width);
    }
  }, [width, onWidthChange]);

  React.useEffect(() => {
    updateRefs(scale.get());
    return scale.onChange(updateRefs);
  }, [updateRefs, scale]);

  return (
    <svg ref={svgRef} width="100%" height="100%">
      <OriginalSquareWrapper width={width} x={padding}>
        <OriginalSquare />
      </OriginalSquareWrapper>
      <Square ref={finalRef} x={padding} />
      <motion.g style={{ x: padding, y: `calc(50% - ${SQUARE_RADIUS}px)` }}>
        <AnchorLine ref={lineRef} x1="2" y1="2" y2="118" />
        <TranslateText ref={textRef} y={64} textAnchor="middle" />
      </motion.g>
    </svg>
  );
};

const Square = styled(SvgSquare, {
  y: `calc(50% - ${SQUARE_RADIUS}px)`,
});

const OriginalSquareWrapper = styled("foreignObject", {
  height: SQUARE_RADIUS * 2,
  rx: "$radii$base",
  y: `calc(50% - ${SQUARE_RADIUS}px)`,
  filter: "drop-shadow($shadows$sm)",
});

const OriginalSquare = styled("div", {
  background: `repeating-linear-gradient(-45deg, $colors$gray8, $colors$gray8 8px, transparent 8px, transparent 16px)`,
  border: "1px solid $gray8",
  height: SQUARE_RADIUS * 2,
  width: "100%",
  borderRadius: "$base",
});

const TranslateText = styled(motion.text, {
  fontFamily: "$mono",
  fontSize: "$sm",
  fill: "$blue11",
});

const AnchorLine = styled("line", {
  stroke: "$blue8",
  strokeWidth: 1,
  strokeDasharray: "6",
});
