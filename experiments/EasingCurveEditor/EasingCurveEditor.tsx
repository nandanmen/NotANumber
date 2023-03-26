import React, { type ComponentPropsWithoutRef } from "react";
import { motion, transform, type PanInfo } from "framer-motion";
import produce from "immer";
import { styled } from "~/stitches.config";

export type CubicBezier = [number, number, number, number];

export type EasingCurveEditorProps = {
  easing: CubicBezier;
  onEasingChange: (easing: CubicBezier) => void;
  rulers?: boolean;
};

const useClientRect = (element: Element | null) => {
  const [box, setBox] = React.useState(null);

  React.useEffect(() => {
    setBox(element?.getBoundingClientRect());
  }, [element]);

  return box;
};

export const config = {
  size: 100,
  padding: {
    x: 20,
    y: 55,
  },
  axisOffset: 3,
};

export const viewbox = `-${config.padding.x} -${
  config.size + config.padding.y
} ${config.size + 2 * config.padding.x} ${config.size + 2 * config.padding.y}`;

export const EasingCurveEditor = ({
  easing,
  onEasingChange,
  rulers = false,
}: EasingCurveEditorProps) => {
  const [panning, setPanning] = React.useState<"first" | "second" | null>(null);

  const svgRef = React.useRef<SVGSVGElement>(null);
  const lineRef = React.useRef<SVGLineElement>(null);
  const box = useClientRect(svgRef.current);
  const lineBox = useClientRect(lineRef.current);
  const padding = lineBox?.left - box?.left;

  const transformX = transform([0, box?.width - padding * 2], [0, 1]);
  const transformY = transform([0, box?.height], [1.5, -0.5]);
  const [x1, y1, x2, y2] = easing.map((n) => n * config.size);

  const handleDrag = (second?: boolean) => (evt: MouseEvent, info: PanInfo) => {
    evt.preventDefault();
    const box = svgRef.current?.getBoundingClientRect();
    const relativeX = info.point.x - box?.left;
    const relativeY = info.point.y - box?.top;
    onEasingChange(
      produce(easing, (draft) => {
        draft[second ? 2 : 0] = transformX(relativeX - padding);
        draft[second ? 3 : 1] = transformY(relativeY);
      })
    );
  };

  return (
    <svg viewBox={viewbox} ref={svgRef}>
      <Axis
        dashed
        x1="0"
        y1={-config.size}
        x2={config.axisOffset + config.size}
        y2={-config.size}
      />
      <Axis
        dashed
        x1={config.size}
        y1={-config.size - config.axisOffset}
        x2={config.size}
        y2="0"
      />
      <Text x="0" y="12" textAnchor="middle">
        0
      </Text>
      <Text x={config.size} y="12" textAnchor="middle">
        1
      </Text>
      <Text x="-9" y="0" dominantBaseline="middle">
        0
      </Text>
      <Text x="-9" y={-config.size} dominantBaseline="middle">
        1
      </Text>
      <g>
        <Axis
          x1={-config.axisOffset}
          y1="0"
          x2={config.size + config.axisOffset}
          y2="0"
        />
        <Axis
          x1={config.size}
          y1={-config.axisOffset}
          x2={config.size}
          y2={config.axisOffset}
        />
      </g>
      <g>
        <Axis
          x1="0"
          y1={config.axisOffset}
          x2="0"
          y2={-config.size - config.axisOffset}
          ref={lineRef}
        />
        <Axis
          x1={-config.axisOffset}
          y1={-config.size}
          x2={config.axisOffset}
          y2={-config.size}
        />
      </g>
      <ControlLine x1="0" y1="0" x2={x1} y2={-y1} color="blue" />
      <ControlLine
        x1={config.size}
        y1={-config.size}
        x2={x2}
        y2={-y2}
        color="green"
      />
      <Path
        animate={{
          d: `M 0 0 C ${x1} ${-y1} ${x2} ${-y2} ${config.size} -${config.size}`,
        }}
      />
      {rulers && (
        <>
          <Line
            color="blue"
            x1={-config.size * 2}
            x2={config.size * 2}
            y1={-y1}
            y2={-y1}
          />
          <Line
            color="blue"
            x1={x1}
            x2={x1}
            y1={-config.size * 2}
            y2={config.size * 2}
          />
          <Line
            color="green"
            x1={-config.size * 2}
            x2={config.size * 2}
            y1={-y2}
            y2={-y2}
          />
          <Line
            color="green"
            x1={x2}
            x2={x2}
            y1={-config.size * 2}
            y2={config.size * 2}
          />
        </>
      )}
      <motion.g animate={{ x: x1, y: -y1 }}>
        <Circle color="blue" active={panning === "first"} />
        <Point
          color="blue"
          onPanStart={() => setPanning("first")}
          onPan={handleDrag()}
          onPanEnd={() => setPanning(null)}
        />
      </motion.g>
      <motion.g animate={{ x: x2, y: -y2 }}>
        <Circle color="green" active={panning === "second"} />
        <Point
          color="green"
          onPanStart={() => setPanning("second")}
          onPan={handleDrag(true)}
          onPanEnd={() => setPanning(null)}
        />
      </motion.g>
    </svg>
  );
};

type LineProps = ComponentPropsWithoutRef<typeof _Line> & {
  color: string;
};

const Line = ({ color, ...props }: LineProps) => (
  <_Line stroke={`var(--colors-${color}7)`} {...props} />
);

const _Line = styled("line", {
  strokeWidth: 1,
  strokeDasharray: "2",
});

type CircleProps = ComponentPropsWithoutRef<typeof motion.circle> & {
  color: string;
  active?: boolean;
};

const Circle = ({ color, active, ...props }: CircleProps) => (
  <motion.circle
    animate={{ r: active ? 7 : 2 }}
    fill={`var(--colors-${color}7)`}
    {...props}
  />
);

const ControlLine = ({ x2 = 0, y2 = 0, color, ...props }) => {
  return (
    <_ControlLine
      css={{ stroke: `var(--colors-${color}7)` }}
      animate={{ x2, y2 }}
      {...props}
    />
  );
};

const _ControlLine = styled(motion.line, {
  strokeWidth: 2,
});

type PointProps = ComponentPropsWithoutRef<typeof _Point> & {
  cx?: number;
  cy?: number;
  color: string;
};

const Point = ({ cx = 0, cy = 0, color, ...props }: PointProps) => {
  return (
    <_Point
      css={{ fill: `var(--colors-${color}5)` }}
      animate={{ cx, cy }}
      r="5"
      {...props}
    />
  );
};

const _Point = styled(motion.circle, {
  strokeWidth: 1,
  stroke: "$gray12",
  cursor: "pointer",
});

const Text = styled("text", {
  fontFamily: "$mono",
  fontSize: 9,
  fontWeight: "bold",
  fill: "$gray10",
  userSelect: "none",
});

const Axis = styled("line", {
  stroke: "$gray8",
  strokeWidth: 1,

  variants: {
    dashed: {
      true: {
        strokeDasharray: "2 1",
      },
    },
  },
});

const Path = styled(motion.path, {
  stroke: "$gray12",
  strokeWidth: 2,
  fill: "none",
});
