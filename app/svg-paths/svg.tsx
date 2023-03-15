"use client";

import React from "react";

const getRelativeFunction = (size: number) => (value: number) => {
  return (value / 100) * size;
};

type Config = {
  padding: number;
};

const SvgContext = React.createContext<{
  size: number;
  config: Config;
  getRelative: (value: number) => number;
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
  const _config = { ...defaultConfig, ...config };
  const getRelative = getRelativeFunction(size);
  const padding = getRelative(_config.padding);

  return (
    <svg
      viewBox={`-${padding} -${padding} ${size + padding * 2} ${
        size + padding * 2
      }`}
    >
      <SvgContext.Provider value={{ size, config: _config, getRelative }}>
        {range(size).flatMap((x) => {
          return range(size).map((y) => {
            return <Dot key={`${x}-${y}`} x={x} y={y} />;
          });
        })}
        <Axes />
        {children}
      </SvgContext.Provider>
    </svg>
  );
}

function Axes() {
  const { size, getRelative } = useSvgContext();
  const fontSize = getRelative(2);
  const offset = getRelative(4);
  return (
    <g>
      <g>
        {range(size, 0, 5).map((x) => {
          return (
            <text
              key={x}
              y={-offset}
              x={x}
              fontSize={fontSize}
              className="font-mono fill-gray10"
              textAnchor="middle"
            >
              {x}
            </text>
          );
        })}
      </g>
      {range(size, 0, 5).map((y) => {
        return (
          <text
            key={y}
            x={-offset}
            y={y}
            fontSize={fontSize}
            className="font-mono fill-gray10"
            dominantBaseline="middle"
            textAnchor="end"
          >
            {y}
          </text>
        );
      })}
    </g>
  );
}

function Dot({ x, y }: { x: number; y: number }) {
  const { getRelative } = useSvgContext();
  const isHighlighted = x % 5 === 0 && y % 5 === 0;
  const radius = getRelative(isHighlighted ? 0.5 : 0.2);
  return <circle cx={x} cy={y} r={radius} className="fill-gray8" />;
}
