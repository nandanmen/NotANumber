import React from "react";
import { motion } from "framer-motion";
import { styled } from "~/stitches.config";
import { PathVisualizer, parse } from "~/components/PathVisualizer";

const range = (start: number, end: number, skip = 1) => {
  const nums = [];
  for (let i = start; i <= end; i += skip) {
    nums.push(i);
  }
  return nums;
};

const TEXT_SIZE_FACTOR = 2 / 100;
const TEXT_GAP_FACTOR = 1.5 / 100;
const STROKE_WIDTH_FACTOR = 0.2 / 100;
const STROKE_DASH_FACTOR = 1 / 100;
const PADDING_FACTOR = 6 / 100;

export function PathPlayground({
  commands = parse(`M 10 20\nL 30 40`),
  size = 25,
  step = 5,
  activeIndex = undefined,
}) {
  const columns = range(0, size, step);
  const rows = range(0, size, step);
  const padding = size * PADDING_FACTOR;

  const viewBox = `${-padding} ${-padding} ${size + padding * 2} ${
    size + padding * 2
  }`;
  const fontSize = size * TEXT_SIZE_FACTOR;
  const labelOffset = size * TEXT_GAP_FACTOR;

  return (
    <SvgWrapper>
      <svg width="100%" height="100%" viewBox={viewBox}>
        {columns.map((x) => (
          <GridLine
            key={`column-${x}`}
            x1={x}
            x2={x}
            y1={-padding}
            y2={size + padding}
            strokeWidth={size * STROKE_WIDTH_FACTOR}
            strokeDasharray={size * STROKE_DASH_FACTOR}
          />
        ))}
        {rows.map((y) => (
          <GridLine
            key={`row-${y}`}
            x1={-padding}
            x2={size + padding}
            strokeWidth={size * STROKE_WIDTH_FACTOR}
            strokeDasharray={size * STROKE_DASH_FACTOR}
            y1={y}
            y2={y}
          />
        ))}
        <PathVisualizer
          commands={commands}
          size={size}
          activeIndex={activeIndex}
        />
        <OriginPoint r={size / 68} strokeWidth={size / 68 / 3} />
        <g
          style={{
            transform: `translate(-${labelOffset}px, -${labelOffset}px)`,
          }}
        >
          {rows.map((y) => (
            <LabelText
              fontSize={fontSize}
              key={`row-label-${y}`}
              x="0"
              y={y}
              textAnchor="end"
            >
              {y}
            </LabelText>
          ))}
        </g>
        <g
          style={{
            transform: `translate(-${labelOffset}px, -${labelOffset}px)`,
          }}
        >
          {columns.map((x) => (
            <LabelText
              fontSize={fontSize}
              key={`col-label-${x}`}
              x={x}
              y="0"
              textAnchor="end"
            >
              {x}
            </LabelText>
          ))}
        </g>
      </svg>
    </SvgWrapper>
  );
}

const Point = (props) => {
  return <motion.circle {...props} />;
};

const OriginPoint = styled(Point, {
  stroke: "$gray8",
  fill: "$gray3",
});

const LabelText = styled("text", {
  fontFamily: "$mono",
  fill: "$gray9",
  fontWeight: "bold",
});

const GridLine = styled("line", {
  stroke: "$gray8",
});

const SvgWrapper = styled("main", {
  aspectRatio: 1,
  height: "100%",
  width: "fit-content",

  svg: {
    display: "block",
  },
});
