import React from "react";
import { MotionValue, useTransform } from "framer-motion";

import { BaseSvgSquare } from "../shared/styles";
import { LineEndpoint, Line } from "../shared/HorizontalRuler";

export type MotionSquareProps = {
  width: MotionValue<number>;
  showScaleRulers?: boolean;
  topLeft?: boolean;
};

export const MotionSquare = ({
  width,
  topLeft = false,
  showScaleRulers = false,
}: MotionSquareProps) => {
  return (
    <g>
      <BaseSvgSquare style={{ width, height: width }} />
      {showScaleRulers && <ScaleRulers width={width} topLeft={topLeft} />}
    </g>
  );
};

export const ScaleRulers = ({
  width,
  topLeft = false,
}: {
  width: MotionValue<number>;
  topLeft?: boolean;
}) => {
  const lineRef = React.useRef<SVGLineElement>(null);
  const radius = useTransform(width, (width) => width / 2);

  const initialWidth = width.get();
  const initialRadius = radius.get();

  React.useEffect(() => {
    return width.onChange((width) => {
      lineRef.current?.setAttribute("x2", width.toString());
      if (topLeft) {
        lineRef.current?.setAttribute("y2", width.toString());
      }
    });
  }, [width, topLeft]);

  React.useEffect(() => {
    return radius.onChange((radius) => {
      if (!topLeft) {
        lineRef.current?.setAttribute("x1", radius.toString());
        lineRef.current?.setAttribute("y1", radius.toString());
      }
    });
  }, [radius, topLeft]);

  return (
    <g>
      <Line
        ref={lineRef}
        x1={topLeft ? 0 : initialRadius}
        x2={initialWidth}
        y1={topLeft ? 0 : initialRadius}
        y2={topLeft ? initialWidth : 0}
      />
      <LineEndpoint
        style={{ x: topLeft ? 0 : radius, y: topLeft ? 0 : radius }}
        css={{ fill: "$blue8", stroke: "$blue2" }}
      />
      <LineEndpoint style={{ x: width, y: topLeft ? width : 0 }} />
    </g>
  );
};
