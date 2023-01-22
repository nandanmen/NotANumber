import React from "react";
import { FullWidth } from "~/components/FullWidth";
import { Slider } from "~/components/Slider";
import { Visualizer, Content } from "~/components/Visualizer";
import { styled } from "~/stitches.config";

const functions = ["sin", "cos", "tan"] as const;

export const TrigonometryFunctions = () => {
  const [angle, setAngle] = React.useState(30);
  const angleInRadians = (angle * Math.PI) / 180;
  return (
    <FullWidth>
      <Controls>
        <Slider
          min={0}
          max={90}
          value={[angle]}
          onValueChange={([v]) => setAngle(v)}
        />
      </Controls>
      <Wrapper>
        {functions.map((type) => {
          return (
            <div key={type}>
              <Visualizer>
                <Content>
                  <svg viewBox="0 0 100 150">
                    <Triangle angle={angle} type={type} />
                  </svg>
                </Content>
              </Visualizer>
              <TextWrapper>
                {type} {angle}° = {Math[type](angleInRadians).toFixed(3)}
              </TextWrapper>
            </div>
          );
        })}
      </Wrapper>
    </FullWidth>
  );
};

const TextWrapper = styled("p", {
  textAlign: "center",
  fontFamily: "$mono",
  fontSize: "$lg",
  marginTop: "$4",
});

const Controls = styled("div", {
  marginBottom: "$6",
});

const DEFAULT_CONFIG = {
  x: 20,
  y: 30,
  size: 100,
};

export const Triangle = ({
  angle,
  type,
  config = DEFAULT_CONFIG,
  initial = true,
}: {
  angle: number;
  type: "sin" | "cos" | "tan";
  config?: Partial<typeof DEFAULT_CONFIG>;
  initial?: boolean;
}) => {
  const angleInRadians = (angle * Math.PI) / 180;
  const { x, y, size } = { ...DEFAULT_CONFIG, ...config };
  const height = Math.cos(angleInRadians) * size;
  const width = Math.sin(angleInRadians) * size;
  return (
    <g>
      {initial && (
        <>
          <line
            x1={x}
            y1={y}
            x2={x}
            y2={y + size}
            stroke="var(--colors-gray8)"
          />
          <circle cx={x} cy={y + size} fill="var(--colors-gray8)" r="2" />
        </>
      )}
      <Arc cx={x} cy={y} r={30} angle={angle} />
      <Line
        data-line-type="hypotenuse"
        x1={x}
        y1={y}
        x2={x + width}
        y2={y + height}
        type={type === "tan" ? undefined : "denominator"}
      />
      <Line
        data-line-type="adjacent"
        x1={x}
        y1={y}
        x2={x}
        y2={y + height}
        type={
          type === "cos"
            ? "numerator"
            : type === "tan"
            ? "denominator"
            : undefined
        }
      />
      <Line
        data-line-type="opposite"
        x1={x}
        y1={y + height}
        x2={x + width}
        y2={y + height}
        type={type === "cos" ? undefined : "numerator"}
      />
      <Endpoint
        data-line-type="hypotenuse"
        r="3"
        cx={x}
        cy={y}
        type={type === "tan" ? undefined : "denominator"}
      />
      <Endpoint
        data-line-type="adjacent"
        r="3"
        cx={x}
        cy={y + height}
        type={
          type === "cos"
            ? "numerator"
            : type === "tan"
            ? "denominator"
            : undefined
        }
      />
      <Endpoint
        data-line-type="opposite"
        r="3"
        cx={x + width}
        cy={y + height}
        type={type === "cos" ? undefined : "numerator"}
      />
    </g>
  );
};

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

type ArcProps = {
  cx: number;
  cy: number;
  r: number;
  angle: number;
};

const Arc = ({ cx, cy, r, angle }: ArcProps) => {
  const { x, y } = polarToCartesian(cx, cy, r, 180 - angle);
  return <ArcPath d={`M ${cx} ${cy + r} A ${r} ${r} 0 0 0 ${x} ${y}`} />;
};

const ArcPath = styled("path", {
  fill: "none",
  stroke: "$gray8",
  strokeWidth: 1.5,
});

const Line = styled("line", {
  strokeWidth: 2,
  stroke: "$gray12",
  variants: {
    type: {
      numerator: {
        stroke: "$green10",
      },
      denominator: {
        stroke: "$blue10",
      },
    },
  },
});

const Endpoint = styled("circle", {
  fill: "$gray4",
  stroke: "$gray12",
  strokeWidth: 1.5,
  variants: {
    type: {
      numerator: {
        stroke: "$green10",
      },
      denominator: {
        stroke: "$blue10",
      },
    },
  },
});

const Wrapper = styled("div", {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "$4",
});
