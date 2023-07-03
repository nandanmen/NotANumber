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
import { useMediaQuery } from "./hooks/use-media-query";

const getRelativeFunction = (size: number) => (value: number) => {
  return (value / 100) * size;
};

const getRelativeMotionValueHook =
  (size: MotionValue<number>) => (value: number) => {
    return useTransform(size, (s) => (value / 100) * s);
  };

export type Config = {
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
  container: SVGSVGElement;
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
  size = 25,
  config = defaultConfig,
  width = "auto",
  height = "100%",
  grid = true,
  children,
  ...props
}: {
  size?: number;
  children?: React.ReactNode;
  config?: Partial<Config>;
  width?: string;
  height?: string;
  grid?: boolean;
} & React.ComponentPropsWithoutRef<(typeof motion)["svg"]>) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const containerRef = React.useRef();
  const thinGridPattern = React.useId();
  const gridPattern = React.useId();
  const sizeMotion = useMotionValue(size);

  const _config = { ...defaultConfig, ...config };
  const getRelative = getRelativeFunction(size);
  const panX = useMotionValue(_config.pan.x);
  const panY = useMotionValue(_config.pan.y);

  const useRelativeMotionValue = getRelativeMotionValueHook(sizeMotion);
  const padding = useRelativeMotionValue(isMobile ? 10 : _config.padding);
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
    <motion.svg
      width={width}
      height={height}
      viewBox={viewBox}
      data-svg
      {...props}
    >
      <SvgContext.Provider
        value={{
          size,
          config: _config,
          getRelative,
          panX,
          panY,
          container: containerRef.current,
          useRelativeMotionValue: (value: number) => {
            return useTransform(sizeMotion, (s) => {
              return (value / 100) * s;
            });
          },
        }}
      >
        <g style={{ opacity: grid ? 1 : 0 }}>
          <defs>
            <pattern
              id={thinGridPattern}
              patternUnits="userSpaceOnUse"
              width="1"
              height="1"
            >
              <motion.line
                x1="1"
                y1="0"
                x2="1"
                y2="1"
                className="stroke-gray7"
                strokeWidth={useRelativeMotionValue(0.25)}
              />
              <motion.line
                x1="0"
                y1="1"
                x2="1"
                y2="1"
                className="stroke-gray7"
                strokeWidth={useRelativeMotionValue(0.25)}
              />
            </pattern>
            <pattern
              id={gridPattern}
              patternUnits="userSpaceOnUse"
              width="5"
              height="5"
            >
              <rect width="5" height="5" fill={`url(#${thinGridPattern})`} />
              <motion.line
                x1="5"
                y1="0"
                x2="5"
                y2="5"
                className="stroke-gray7"
                strokeWidth={useRelativeMotionValue(0.5)}
              />
              <motion.line
                x1="0"
                y1="5"
                x2="5"
                y2="5"
                className="stroke-gray7"
                strokeWidth={useRelativeMotionValue(0.5)}
              />
            </pattern>
          </defs>
          <AxesLabels />
          <motion.rect
            data-svg-grid
            ref={containerRef}
            x={config.pan.x}
            y={config.pan.y}
            width={size}
            height={size}
            className="stroke-gray7"
            strokeWidth={useRelativeMotionValue(0.25)}
            fill={`url(#${gridPattern})`}
          />
        </g>
        {children}
      </SvgContext.Provider>
    </motion.svg>
  );
}

const GAP = 5;

function AxesLabels() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { size, useRelativeMotionValue, panX, panY, config } = useSvgContext();
  const fontSize = useRelativeMotionValue(isMobile ? 4 : 2);
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
