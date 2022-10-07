import React from "react";
import { MotionValue, useTransform } from "framer-motion";

import { BaseSvgSquare } from "../shared/styles";
import { LineEndpoint, Line } from "../shared/HorizontalRuler";

export type MotionSquareProps = {
  width: MotionValue<number>;
  showScaleRulers?: boolean;
};

export const MotionSquare = ({
  width,
  showScaleRulers = false,
}: MotionSquareProps) => {
  return (
    <g>
      <BaseSvgSquare style={{ width, height: width }} />
      {showScaleRulers && <ScaleRulers width={width} />}
    </g>
  );
};

export const ScaleRulers = ({ width }: { width: MotionValue<number> }) => {
  const lineRef = React.useRef<SVGLineElement>();
  const radius = useTransform(width, (width) => width / 2);

  const initialWidth = width.get();
  const initialRadius = radius.get();

  React.useEffect(() => {
    return width.onChange((width) => {
      lineRef.current?.setAttribute("x2", width.toString());
    });
  }, [width]);

  React.useEffect(() => {
    return radius.onChange((radius) => {
      lineRef.current?.setAttribute("x1", radius.toString());
      lineRef.current?.setAttribute("y1", radius.toString());
    });
  }, [radius]);

  return (
    <g>
      <Line
        ref={lineRef}
        x1={initialRadius}
        x2={initialWidth}
        y1={initialRadius}
        y2="0"
      />
      <LineEndpoint style={{ x: radius, y: radius }} />
      <LineEndpoint style={{ x: width }} />
    </g>
  );
};
