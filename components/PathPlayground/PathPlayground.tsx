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

type SvgConfig = {
  size: number;
  columns: number[];
  rows: number[];
};

export function PathAxes({ size, columns, rows }: SvgConfig) {
  const padding = size * PADDING_FACTOR;
  return (
    <>
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
    </>
  );
}

export function AxesLabels({ size, columns, rows }: SvgConfig) {
  const fontSize = size * TEXT_SIZE_FACTOR;
  const labelOffset = size * TEXT_GAP_FACTOR;
  return (
    <>
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
    </>
  );
}

type PathBackgroundProps = {
  size: number;
  step: number;
  children?: React.ReactNode;
};

const BackgroundContext = React.createContext<{
  size: number;
  endpointSize: number;
  strokeWidth: number;
  padding: number;
}>(null);

const ENDPOINT_SCALE_FACTOR = 68;

export const useBackgroundContext = () => React.useContext(BackgroundContext);

export function PathBackground({ size, step, children }: PathBackgroundProps) {
  const columns = range(0, size, step);
  const rows = range(0, size, step);
  const padding = size * PADDING_FACTOR;
  const viewBox = `${-padding} ${-padding} ${size + padding * 2} ${
    size + padding * 2
  }`;
  const endpointSize = size / ENDPOINT_SCALE_FACTOR;
  return (
    <SvgWrapper>
      <svg width="100%" height="100%" viewBox={viewBox}>
        <BackgroundContext.Provider
          value={{ size, endpointSize, strokeWidth: endpointSize / 4, padding }}
        >
          <PathAxes size={size} columns={columns} rows={rows} />
          <AxesLabels size={size} columns={columns} rows={rows} />
          {children}
        </BackgroundContext.Provider>
      </svg>
    </SvgWrapper>
  );
}

export function PathPlayground({
  commands = parse(`M 10 20\nL 30 40`),
  size = 25,
  step = 5,
  activeIndex = undefined,
}) {
  return (
    <PathBackground size={size} step={step}>
      <PathVisualizer
        commands={commands}
        size={size}
        activeIndex={activeIndex}
      />
      <OriginPoint r={size / 68} strokeWidth={size / 68 / 3} />
    </PathBackground>
  );
}

const OriginPoint = styled(motion.circle, {
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

const SvgWrapper = styled("div", {
  aspectRatio: 1,
  height: "100%",

  svg: {
    display: "block",
  },
});
