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
  pan: {
    x: number;
    y: number;
  };
};

const SvgContext = React.createContext<{
  size: number;
  config: Config;
  getRelative: (value: number) => number;
  useRelativeMotionValue: (value: number) => MotionValue<number>;
  panX: MotionValue<number>;
  panY: MotionValue<number>;
}>(null);

export const useSvgContext = () => {
  return React.useContext(SvgContext);
};

const defaultConfig: Config = {
  pan: {
    x: 0,
    y: 0,
  },
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
  const sizeMotion = useMotionValue(size);

  const _config = { ...defaultConfig, ...config };
  const getRelative = getRelativeFunction(size);
  const panX = useMotionValue(_config.pan.x);
  const panY = useMotionValue(_config.pan.y);

  const useRelativeMotionValue = getRelativeMotionValueHook(sizeMotion);
  const padding = useRelativeMotionValue(_config.padding);
  const realSize = useTransform(
    [sizeMotion, padding],
    ([s, p]: [number, number]) => s + p + p / 2
  );
  const startX = useTransform(
    [padding, panX],
    ([p, x]: [number, number]) => x - p
  );
  const startY = useTransform(
    [padding, panY],
    ([p, y]: [number, number]) => y - p
  );
  const viewBox = useMotionTemplate`${startX} ${startY} ${realSize} ${realSize}`;

  React.useEffect(() => {
    animate(panX, _config.pan.x, {
      type: "spring",
      bounce: 0,
    });
  }, [panX, _config.pan.x]);

  React.useEffect(() => {
    animate(panY, _config.pan.y, {
      type: "spring",
      bounce: 0,
    });
  }, [panY, _config.pan.y]);

  React.useEffect(() => {
    animate(sizeMotion, size, {
      type: "spring",
      bounce: 0,
    });
  }, [size, sizeMotion]);

  return (
    <motion.svg width="auto" height="100%" viewBox={viewBox}>
      <SvgContext.Provider
        value={{
          size,
          config: _config,
          getRelative,
          panX,
          panY,
          useRelativeMotionValue: (value: number) => {
            return useTransform(sizeMotion, (s) => {
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
  const { size, useRelativeMotionValue, panX, panY, config } = useSvgContext();
  const fontSize = useRelativeMotionValue(2);
  const offset = useRelativeMotionValue(-4);
  const offsetX = useTransform(
    [offset, panX],
    ([o, x]: [number, number]) => o + x
  );
  const offsetY = useTransform(
    [offset, panY],
    ([o, y]: [number, number]) => o + y
  );

  const cols = range(size + config.pan.x, config.pan.x, GAP);
  const rows = range(size + config.pan.y, config.pan.y, GAP);

  return (
    <g>
      <g data-x-axis>
        {cols.map((x) => {
          return (
            <motion.text
              key={x}
              y={offsetY}
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
        {rows.map((y) => {
          return (
            <motion.text
              key={y}
              x={offsetX}
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
  const { size, useRelativeMotionValue, config } = useSvgContext();
  const { x: panX, y: panY } = config.pan;
  const cols = range(size + panX, panX);
  const rows = range(size + panY, panY);
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
              y1={panY}
              y2={size + panY}
            />
          );
        })}
      </g>
      <g data-y-axis-lines>
        {rows.map((y) => {
          return (
            <motion.line
              key={y}
              strokeWidth={isHighlighted(y) ? highlightedStroke : stroke}
              y1={y}
              y2={y}
              x1={panX}
              x2={size + panX}
            />
          );
        })}
      </g>
    </g>
  );
}
