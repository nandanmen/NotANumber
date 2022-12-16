import React, { ComponentPropsWithoutRef } from "react";
import bezier from "bezier-easing";
import produce from "immer";
import {
  motion,
  useAnimationControls,
  transform,
  PanInfo,
} from "framer-motion";

import { FullWidth } from "~/components/FullWidth";
import {
  Visualizer,
  Content,
  Controls,
  PlayButton,
} from "~/components/Visualizer";
import { styled } from "~/stitches.config";

const easingFunctions = {
  linear: [0, 0, 1, 1],
  ease: [0.25, 0.1, 0.25, 1],
  "ease-in": [0.42, 0, 1, 1],
  "ease-out": [0, 0, 0.58, 1],
  "ease-in-out": [0.42, 0, 0.58, 1],
} as const;

const SQUARE_SIZE = 160;

const transformX = transform([0, 295], [0, 1]);
const transformY = transform([0, 560], [1.5, -0.5]);

export const EasingFunctionSandbox = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);
  const [height, setHeight] = React.useState(0);
  const [easing, setEasing] = React.useState<[number, number, number, number]>([
    0.25, 0.1, 0.25, 1,
  ]);
  const [activePan, setActivePan] = React.useState<number | null>(null);
  const [activePoint, setActivePoint] = React.useState<
    "first" | "second" | null
  >(null);
  const [panning, setPanning] = React.useState<"first" | "second" | null>(null);
  const controls = useAnimationControls();

  React.useEffect(() => {
    if (containerRef.current) {
      setHeight(containerRef.current.offsetHeight);
    }
  }, []);

  const trueHeight = height - 64;
  const play = async () => {
    await controls.start({ y: 0, transition: { type: false } });
    controls.start({
      y: trueHeight - SQUARE_SIZE,
      transition: {
        duration: 1,
        ease: bezier(...easing),
      },
    });
  };

  const [x1, y1, x2, y2] = easing.map((n) => n * 100);
  const handleEasingPan = (index: number) => (value: number) => {
    if (!(index % 2)) {
      value = Math.max(0, Math.min(1, value));
    }
    setEasing((easing) =>
      produce(easing, (draft) => {
        draft[index] = value;
      })
    );
  };

  const handleDrag = (second?: boolean) => (evt: MouseEvent, info: PanInfo) => {
    evt.preventDefault();
    const box = svgRef.current?.getBoundingClientRect();
    const relativeX = info.point.x - box?.left;
    const relativeY = info.point.y - box?.top;
    setEasing((easing) =>
      produce(easing, (draft) => {
        draft[second ? 2 : 0] = transformX(relativeX - 40);
        draft[second ? 3 : 1] = transformY(relativeY);
      })
    );
  };

  return (
    <FullWidth>
      <Visualizer css={{ display: "flex" }}>
        <Aside>
          <CodeBlock>
            {easing.map((value, index) => {
              const isFirstPoint = index === 0 || index === 1;
              const name = isFirstPoint ? "first" : "second";
              return (
                <React.Fragment key={index}>
                  <ButtonSlider
                    active={panning === name || activePoint === name}
                    onValueChange={handleEasingPan(index)}
                    onHoverStart={() => {
                      if (activePan !== null && activePan !== index) return;
                      setActivePan(index);
                    }}
                    onHoverEnd={(panning) => {
                      if (activePan !== index) return;
                      if (panning) return;
                      setActivePan(null);
                    }}
                    onPanEnd={() => setActivePan(null)}
                    value={value}
                  />
                  {index < easing.length - 1 && (
                    <span style={{ color: "#24292F" }}>, </span>
                  )}
                </React.Fragment>
              );
            })}
          </CodeBlock>
          <SvgWrapper>
            <svg viewBox="-20 -155 140 210" ref={svgRef}>
              <Axis dashed x1="0" y1="-100" x2="103" y2="-100" />
              <Axis dashed x1="100" y1="-103" x2="100" y2="0" />
              <Text x="0" y="12" textAnchor="middle">
                0
              </Text>
              <Text x="100" y="12" textAnchor="middle">
                1
              </Text>
              <Text x="-9" y="0" dominantBaseline="middle">
                0
              </Text>
              <Text x="-9" y="-100" dominantBaseline="middle">
                1
              </Text>
              <g>
                <Axis x1="-3" y1="0" x2="100" y2="0" />
                <Axis x1="100" y1="-3" x2="100" y2="3" />
                <Axis x1="100" y1="-3" x2="100" y2="3" />
              </g>
              <g>
                <Axis x1="0" y1="3" x2="0" y2="-100" />
                <Axis x1="-3" y1="-100" x2="3" y2="-100" />
              </g>
              <ControlLine x1="0" y1="0" x2={x1} y2={-y1} color="blue" />
              <ControlLine x1="100" y1="-100" x2={x2} y2={-y2} color="green" />
              <Path
                animate={{ d: `M 0 0 C ${x1} ${-y1} ${x2} ${-y2} 100 -100` }}
              />
              {activePan === 0 && (
                <Line color="blue" x1="-500" x2="500" y1={-y1} y2={-y1} />
              )}
              {activePan === 1 && (
                <Line color="blue" x1={x1} x2={x1} y1="-500" y2="500" />
              )}
              {activePan === 2 && (
                <Line color="green" x1="-500" x2="500" y1={-y2} y2={-y2} />
              )}
              {activePan === 3 && (
                <Line color="green" x1={x2} x2={x2} y1="-500" y2="500" />
              )}
              <motion.g animate={{ x: x1, y: -y1 }}>
                <Circle
                  color="blue"
                  active={
                    activePan === 0 ||
                    activePan === 1 ||
                    activePoint === "first" ||
                    panning === "first"
                  }
                />
                <Point
                  color="blue"
                  onPan={handleDrag()}
                  onPanStart={() => setPanning("first")}
                  onHoverStart={() => {
                    if (activePoint !== null && activePoint !== "first") return;
                    setActivePoint("first");
                  }}
                  onHoverEnd={() => {
                    if (panning === "second") return;
                    setActivePoint(null);
                  }}
                  onPanEnd={() => {
                    setActivePoint(null);
                    setPanning(null);
                  }}
                />
              </motion.g>
              <motion.g animate={{ x: x2, y: -y2 }}>
                <Circle
                  color="green"
                  active={
                    activePan === 2 ||
                    activePan === 3 ||
                    activePoint === "second" ||
                    panning === "second"
                  }
                />
                <Point
                  color="green"
                  onPan={handleDrag(true)}
                  onPanStart={() => setPanning("second")}
                  onHoverStart={() => {
                    if (activePoint !== null && activePoint !== "second")
                      return;
                    setActivePoint("second");
                  }}
                  onHoverEnd={() => {
                    if (panning === "first") return;
                    setActivePoint(null);
                  }}
                  onPanEnd={() => {
                    setActivePoint(null);
                    setPanning(null);
                  }}
                />
              </motion.g>
            </svg>
          </SvgWrapper>
        </Aside>
        <ContentWrapper>
          <Content padding="lg" ref={containerRef} css={{ height: "100%" }}>
            <Ball animate={controls} />
          </Content>
          <Controls css={{ borderTop: "1px solid $gray8" }}>
            <select
              value={Object.keys(easingFunctions).find((key) =>
                easingFunctions[key].every((n, i) => n === easing[i])
              )}
              onChange={(evt) => setEasing(easingFunctions[evt.target.value])}
            >
              {Object.keys(easingFunctions).map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
            <PlayButton onClick={play} />
          </Controls>
        </ContentWrapper>
      </Visualizer>
    </FullWidth>
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

const CodeBlock = ({ children }) => {
  return (
    <CodeWrapper>
      <code data-language="tsx" data-theme="light">
        <span className="line">
          <span style={{ color: "#24292F" }}>&lt;</span>
          <span style={{ color: "#054DA9" }}>motion.div</span>
        </span>
        <span className="line">
          <span style={{ color: "#24292F" }}>{`  `}</span>
          <span style={{ color: "#0550AE" }}>animate</span>
          <span style={{ color: "#AC5E00" }}>={"{"}</span>
          <span style={{ color: "#24292F" }}>{"{"} y: </span>
          <span style={{ color: "#0550AE" }}>100</span>
          <span style={{ color: "#24292F" }}> {"}"}</span>
          <span style={{ color: "#AC5E00" }}>{"}"}</span>
        </span>
        <span className="line">
          <span style={{ color: "#24292F" }}>{`  `}</span>
          <span style={{ color: "#0550AE" }}>transition</span>
          <span style={{ color: "#AC5E00" }}>={"{"}</span>
          <span style={{ color: "#24292F" }}>{"{"}</span>
        </span>
        <span className="line">
          <span style={{ color: "#24292F" }}>{`   `} type: </span>
          <span style={{ color: "#0A3069" }}>"tween"</span>
          <span style={{ color: "#24292F" }}>,</span>
        </span>
        <span className="line">
          <span style={{ color: "#24292F" }}>{`   `} ease: [</span>
          {children}
          <span style={{ color: "#24292F" }}>],</span>
        </span>
        <span className="line">
          <span style={{ color: "#24292F" }}>
            {` `} {"}"}
          </span>
          <span style={{ color: "#AC5E00" }}>{"}"}</span>
        </span>
        <span className="line">
          <span style={{ color: "#24292F" }}>/&gt;</span>
        </span>
      </code>
    </CodeWrapper>
  );
};

const transformPan = transform([-50, 50], [-0.1, 0.1], { clamp: false });

type ButtonSliderProps = {
  onValueChange: (value: number) => void;
  onHoverEnd: (panning: boolean) => void;
  value: number;
  active?: boolean;
} & Omit<React.ComponentPropsWithoutRef<typeof _ButtonSlider>, "onHoverEnd">;

const ButtonSlider = ({
  onValueChange,
  value,
  active = false,
  onPanStart,
  onPanEnd,
  onHoverEnd,
  ...props
}: ButtonSliderProps) => {
  const [panning, setPanning] = React.useState(false);
  return (
    <_ButtonSlider
      active={active || panning}
      onPanStart={(...args) => {
        setPanning(true);
        onPanStart?.(...args);
      }}
      onPanEnd={(...args) => {
        setPanning(false);
        onPanEnd?.(...args);
      }}
      onHoverEnd={() => onHoverEnd(panning)}
      onPan={(_, info) => onValueChange(value + transformPan(info.delta.x))}
      {...props}
    >
      {value.toFixed(2)}
    </_ButtonSlider>
  );
};

const _ButtonSlider = styled(motion.button, {
  color: "#0550AE",

  "&:hover": {
    background: "$blue6",
  },

  variants: {
    active: {
      true: {
        background: "$blue6",
      },
    },
  },
});

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

const ContentWrapper = styled("div", {
  width: "100%",
  flex: 2,
  border: "none !important",
  display: "flex",
  flexDirection: "column",
});

const Aside = styled("aside", {
  width: 375,
  borderRight: "1px solid $gray8",
  display: "flex",
  flexDirection: "column",
  position: "relative",
  background: "$gray4",
});

const CodeWrapper = styled("pre", {
  borderBottom: "1px dashed $gray8",
  fontFamily: "$mono",
  padding: "$8",
  fontSize: "$sm",
});

const SvgWrapper = styled("div", {});

const Ball = styled(motion.div, {
  width: SQUARE_SIZE,
  aspectRatio: 1,
  border: "1px solid $gray12",
  background: "linear-gradient(45deg, $blue7, $blue5)",
  borderRadius: "$base",
  boxShadow: "3px 3px 0 $colors$gray12",
  margin: "0 auto",
});
