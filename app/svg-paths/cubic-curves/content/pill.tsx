import { Circle } from "app/svg-paths/components/svg/circle";
import { Line as BaseLine } from "app/svg-paths/components/svg/line";
import { Path } from "app/svg-paths/components/svg/path";

function getControlPoints(quadratic: boolean) {
  if (quadratic) {
    return {
      x1: 1,
      y1: 5,
      x2: 1,
      y2: 10,
      x3: 14,
      y3: 5,
      x4: 14,
      y4: 10,
    };
  }
  return {
    x1: 0,
    y1: 7.5,
    x2: 0,
    y2: 7.5,
    x3: 15,
    y3: 7.5,
    x4: 15,
    y4: 7.5,
  };
}

function Line(props: React.ComponentPropsWithoutRef<typeof BaseLine>) {
  return (
    <BaseLine
      variant="current"
      transition={{ type: "spring", bounce: 0.2 }}
      {...props}
    />
  );
}

function Point({ x, y }: { x: number; y: number }) {
  return (
    <Circle
      cx={x}
      cy={y}
      variant="cursor"
      animate={{ cx: x, cy: y }}
      transition={{ type: "spring", bounce: 0.2 }}
    />
  );
}

function Pill({ quadratic = false }) {
  const { x1, y1, x2, y2, x3, y3, x4, y4 } = getControlPoints(quadratic);
  return (
    <g>
      <g className="text-blue8">
        <g>
          <Line animate={{ x1: 5, y1: 5, x2: x1, y2: y1 }} />
          <Line animate={{ x1: 5, y1: 10, x2: x2, y2: y2 }} />
          <Line animate={{ x1: 10, y1: 5, x2: x3, y2: y3 }} />
          <Line animate={{ x1: 10, y1: 10, x2: x4, y2: y4 }} />
        </g>
        <g>
          <Point x={x1} y={y1} />
          <Point x={x2} y={y2} />
          <Point x={x3} y={y3} />
          <Point x={x4} y={y4} />
        </g>
      </g>
      <Path d="M 5 5 h 5 M 5 10 h 5" />
      <g className="text-blue11">
        <Path
          transition={{ type: "spring", bounce: 0.2 }}
          d="M 10 5 c 3.3 1.7 3.3 3.3 0 5"
          animate={{
            d: quadratic
              ? "M 10 5 c 4 0 4 5 0 5"
              : "M 10 5 c 3.3 1.7 3.3 3.3 0 5",
          }}
        />
        <Path
          transition={{ type: "spring", bounce: 0.2 }}
          d="M 5 10 c -3.3 -1.7 -3.3 -3.3 0 -5"
          animate={{
            d: quadratic
              ? "M 5 10 c -4 0 -4 -5 0 -5"
              : "M 5 10 c -3.3 -1.7 -3.3 -3.3 0 -5",
          }}
        />
        <Circle variant="point" cx="5" cy="5" />
        <Circle variant="point" cx="5" cy="10" />
        <Circle variant="point" cx="10" cy="5" />
        <Circle variant="point" cx="10" cy="10" />
      </g>
    </g>
  );
}

export const components = { Pill };

export const pages = [
  {
    children: <Pill />,
    svg: 15,
  },
  {
    children: <Pill quadratic />,
    svg: 15,
  },
];
