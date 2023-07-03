import React from "react";
import { motion } from "framer-motion";
import { useSvgContext } from "../svg";
import { useMediaQuery } from "../hooks/use-media-query";

type TooltipProps = {
  x: number;
  y: number;
  placement?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
  fontSize?: number;
};

export function CoordinatesTooltip({
  x,
  y,
  placement = "top",
}: Omit<TooltipProps, "children">) {
  return (
    <Tooltip x={x} y={y} placement={placement}>
      ({x.toFixed(1)}, {y.toFixed(1)})
    </Tooltip>
  );
}

export const Tooltip = ({
  x,
  y,
  placement = "right",
  fontSize,
  children,
}: TooltipProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const textRef = React.useRef<SVGTextElement>(null);
  const [box, setBox] = React.useState<DOMRect>();
  const { getRelative } = useSvgContext();

  React.useLayoutEffect(() => {
    if (textRef.current) {
      setBox(textRef.current.getBBox());
    }
  }, [children]);

  const boxWidth = box?.width || 0;
  const boxHeight = box?.height || 0;
  const width = boxWidth + getRelative(2);
  const height = boxHeight + getRelative(2);
  const _fontSize = fontSize || getRelative(isMobile ? 3.6 : 1.8);

  const _placement = usePlacement({
    x,
    y,
    placement,
    width,
    height,
    offset: 2,
  });
  const points = _placement.arrow.points.map((p) => p.join(",")).join(" ");

  return (
    <motion.g
      className="text-gray1"
      transform={`translate(${_placement.x}, ${_placement.y})`}
      animate={{
        opacity: box ? 1 : 0,
      }}
      transition={{ type: false }}
    >
      <g className="fill-gray12">
        <motion.polygon
          style={{
            x: _placement.arrow.x,
            y: _placement.arrow.y,
          }}
          points={points}
        />
        <rect
          x={_placement.box.x}
          y={_placement.box.y}
          width={width}
          height={height}
          rx={getRelative(0.5)}
        />
      </g>
      <text
        ref={textRef}
        x={_placement.text.x}
        y={_placement.text.y}
        fontSize={_fontSize}
        textAnchor="middle"
        alignmentBaseline="middle"
        className="fill-current font-mono"
      >
        {children}
      </text>
    </motion.g>
  );
};

type Placement = {
  x: number;
  y: number;
  box: {
    x: number;
    y: number;
  };
  text: {
    x: number;
    y: number;
  };
  arrow: {
    x: number;
    y: number;
    points: [number, number][];
  };
};

type PlacementOptions = {
  x: number;
  y: number;
  placement: "right" | "left" | "top" | "bottom";
  width: number;
  height: number;
  offset?: number;
};

const usePlacement = ({
  x,
  y,
  placement,
  width,
  height,
  offset = 0,
}: PlacementOptions): Placement => {
  const { getRelative } = useSvgContext();

  const arrowWidth = getRelative(1.4);
  const textOffset = getRelative(1.3);
  const arrowHeight = getRelative(2);
  const _offset = getRelative(offset);

  switch (placement) {
    case "right": {
      const points = [
        [0, arrowHeight / 2],
        [arrowWidth, 0],
        [arrowWidth, arrowHeight],
      ] as [number, number][];
      return {
        x: x + _offset,
        y: y - height / 2,
        box: {
          x: textOffset,
          y: 0,
        },
        text: {
          x: textOffset + width / 2,
          y: height / 2,
        },
        arrow: {
          x: 0,
          y: height / 2 - arrowHeight / 2,
          points,
        },
      };
    }
    case "left": {
      const points = [
        [0, 0],
        [arrowWidth, arrowHeight / 2],
        [0, arrowHeight],
      ] as [number, number][];
      return {
        x: x - _offset - width - textOffset,
        y: y - height / 2,
        box: {
          x: getRelative(0.1),
          y: 0,
        },
        text: {
          x: getRelative(0.1) + width / 2,
          y: height / 2,
        },
        arrow: {
          x: width,
          y: height / 2 - arrowHeight / 2,
          points,
        },
      };
    }
    case "bottom": {
      const points = [
        [0, arrowWidth],
        [arrowHeight / 2, 0],
        [arrowHeight, arrowWidth],
      ] as [number, number][];
      return {
        x: x - width / 2,
        y: y + _offset,
        box: {
          x: 0,
          y: textOffset,
        },
        text: {
          x: width / 2,
          y: textOffset + height / 2,
        },
        arrow: {
          x: width / 2 - arrowHeight / 2,
          y: 0,
          points,
        },
      };
    }
    case "top": {
      const points = [
        [0, 0],
        [arrowHeight / 2, arrowWidth],
        [arrowHeight, 0],
      ] as [number, number][];
      return {
        x: x - width / 2,
        y: y - _offset - height - textOffset,
        box: {
          x: 0,
          y: getRelative(0.1),
        },
        text: {
          x: width / 2,
          y: getRelative(0.1) + height / 2,
        },
        arrow: {
          x: width / 2 - arrowHeight / 2,
          y: height,
          points,
        },
      };
    }
  }
};
