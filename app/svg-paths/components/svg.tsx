"use client";

import React from "react";
import {
  animate,
  motion,
  type MotionValue,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";

const getRelativeFunction = (size: number) => (value: number) => {
  return (value / 100) * size;
};

const getRelativeMotionValueHook =
  (size: MotionValue<number>) => (value: number) => {
    return useTransform(size, (s) => (value / 100) * s);
  };

type Config = {
  padding: number;
};

const SvgContext = React.createContext<{
  size: number;
  config: Config;
  getRelative: (value: number) => number;
  useRelativeMotionValue: (value: number) => MotionValue<number>;
}>(null);

export const useSvgContext = () => {
  return React.useContext(SvgContext);
};

const defaultConfig: Config = {
  padding: 7,
};

const range = (end: number, start = 0, skip = 1) => {
  const result = [];
  for (let i = start; i <= end; i += skip) {
    result.push(i);
  }
  return result;
};

export function Svg({
  size,
  config = defaultConfig,
  children,
}: {
  size: number;
  children?: React.ReactNode;
  config?: Partial<Config>;
}) {
  const _size = useMotionValue(size);

  const _config = { ...defaultConfig, ...config };
  const getRelative = getRelativeFunction(size);

  const useRelativeMotionValue = getRelativeMotionValueHook(_size);
  const padding = useRelativeMotionValue(_config.padding);
  const realSize = useTransform(
    [_size, padding],
    ([s, p]: [number, number]) => s + p + p / 2
  );
  const viewBox = useMotionTemplate`-${padding} -${padding} ${realSize} ${realSize}`;

  React.useEffect(() => {
    animate(_size, size, {
      type: "spring",
      bounce: 0,
    });
  }, [size, _size]);

  return (
    <motion.svg width="auto" height="100%" viewBox={viewBox}>
      <SvgContext.Provider
        value={{
          size,
          config: _config,
          getRelative,
          useRelativeMotionValue: (value: number) => {
            return useTransform(_size, (s) => {
              return (value / 100) * s;
            });
          },
        }}
      >
        <AxesLines />
        <AxesLabels />
        {children}
      </SvgContext.Provider>
    </motion.svg>
  );
}

const GAP = 5;

function AxesLabels() {
  const { size, useRelativeMotionValue } = useSvgContext();
  const fontSize = useRelativeMotionValue(2);
  const offset = useRelativeMotionValue(-4);
  const cols = range(size, 0, GAP);

  return (
    <g>
      <g data-x-axis>
        {cols.map((x) => {
          return (
            <motion.text
              key={x}
              y={offset}
              x={x}
              fontSize={fontSize}
              className="font-mono fill-gray10"
              textAnchor="middle"
            >
              {x}
            </motion.text>
          );
        })}
      </g>
      <g data-y-axis>
        {cols.map((y) => {
          return (
            <motion.text
              key={y}
              x={offset}
              y={y}
              fontSize={fontSize}
              className="font-mono fill-gray10"
              dominantBaseline="middle"
              textAnchor="end"
            >
              {y}
            </motion.text>
          );
        })}
      </g>
    </g>
  );
}

function AxesLines() {
  const { size, useRelativeMotionValue } = useSvgContext();
  const cols = range(size);
  const stroke = useRelativeMotionValue(0.1);
  const highlightedStroke = useRelativeMotionValue(0.25);
  const isHighlighted = (xOrY: number) => xOrY % 5 === 0;
  return (
    <g className="stroke-gray7">
      <g data-x-axis-lines>
        {cols.map((x) => {
          return (
            <motion.line
              key={x}
              strokeWidth={isHighlighted(x) ? highlightedStroke : stroke}
              x1={x}
              x2={x}
              y1={0}
              y2={size}
            />
          );
        })}
      </g>
      <g data-y-axis-lines>
        {cols.map((y) => {
          return (
            <motion.line
              key={y}
              strokeWidth={isHighlighted(y) ? highlightedStroke : stroke}
              y1={y}
              y2={y}
              x1={0}
              x2={size}
            />
          );
        })}
      </g>
    </g>
  );
}

function Dot({ x, y }: { x: number; y: number }) {
  const { useRelativeMotionValue, size } = useSvgContext();
  const isHighlighted = x % 5 === 0 && y % 5 === 0;
  const radius = useRelativeMotionValue(
    isHighlighted ? 0.5 : size > 25 ? 0.15 : 0.2
  );
  return <motion.circle cx={x} cy={y} r={radius} className="fill-gray8" />;
}
