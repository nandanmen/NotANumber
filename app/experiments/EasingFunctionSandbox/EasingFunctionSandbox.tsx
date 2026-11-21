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
import { cn } from "~/lib/cn";

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
      }),
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
      }),
    );
  };

  return (
    <FullWidth>
      <Visualizer className="flex">
        <aside className="relative flex w-[375px] flex-col border-r border-gray8 bg-gray4">
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
          <div>
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
          </div>
        </aside>
        <div className="flex w-full flex-[2] flex-col border-none!">
          <Content padding="lg" ref={containerRef} className="h-full min-h-0">
            <Ball animate={controls} />
          </Content>
          <Controls className="border-t border-gray8">
            <select
              value={Object.keys(easingFunctions).find((key) =>
                easingFunctions[key].every((n, i) => n === easing[i]),
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
        </div>
      </Visualizer>
    </FullWidth>
  );
};

type LineProps = ComponentPropsWithoutRef<"line"> & {
  color: string;
};

const Line = ({ color, ...props }: LineProps) => (
  <line
    stroke={`var(--color-${color}7)`}
    className="stroke-1 [stroke-dasharray:2]"
    {...props}
  />
);

type CircleProps = ComponentPropsWithoutRef<typeof motion.circle> & {
  color: string;
  active?: boolean;
};

const Circle = ({ color, active, ...props }: CircleProps) => (
  <motion.circle
    animate={{ r: active ? 7 : 2 }}
    fill={`var(--color-${color}7)`}
    {...props}
  />
);

const CodeBlock = ({ children }) => {
  return (
    <pre className="border-b border-dashed border-gray8 p-8 font-mono text-[0.875rem]">
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
    </pre>
  );
};

const transformPan = transform([-50, 50], [-0.1, 0.1], { clamp: false });

type ButtonSliderProps = {
  onValueChange: (value: number) => void;
  onHoverEnd?: (panning: boolean) => void;
  value: number;
  active?: boolean;
} & Omit<React.ComponentPropsWithoutRef<typeof motion.button>, "onHoverEnd">;

export const ButtonSlider = ({
  onValueChange,
  value,
  active = false,
  onPanStart,
  onPanEnd,
  onHoverEnd,
  className,
  ...props
}: ButtonSliderProps) => {
  const [panning, setPanning] = React.useState(false);
  return (
    <motion.button
      type="button"
      className={cn(
        "text-(--text-color,#0550AE) hover:bg-(--active-color,var(--color-blue6))",
        (active || panning) && "bg-(--active-color,var(--color-blue6))",
        className,
      )}
      onPanStart={(...args) => {
        setPanning(true);
        onPanStart?.(...args);
      }}
      onPanEnd={(...args) => {
        setPanning(false);
        onPanEnd?.(...args);
      }}
      onHoverEnd={() => onHoverEnd?.(panning)}
      onPan={(_, info) => onValueChange(value + transformPan(info.delta.x))}
      {...props}
    >
      {value.toFixed(2)}
    </motion.button>
  );
};

const ControlLine = ({ x2 = 0, y2 = 0, color, ...props }) => {
  return (
    <motion.line
      className="stroke-2"
      style={{ stroke: `var(--color-${color}7)` }}
      animate={{ x2, y2 }}
      {...props}
    />
  );
};

type PointProps = ComponentPropsWithoutRef<typeof motion.circle> & {
  cx?: number;
  cy?: number;
  color: string;
};

const Point = ({ cx = 0, cy = 0, color, ...props }: PointProps) => {
  return (
    <motion.circle
      className="cursor-pointer stroke-gray12 stroke-1"
      style={{ fill: `var(--color-${color}5)` }}
      animate={{ cx, cy }}
      r="5"
      {...props}
    />
  );
};

const Text = ({ className, ...props }: ComponentPropsWithoutRef<"text">) => (
  <text
    className={cn(
      "fill-gray10 font-mono text-[9px] font-bold select-none",
      className,
    )}
    {...props}
  />
);

const Axis = ({
  dashed,
  className,
  ...props
}: React.ComponentProps<"line"> & { dashed?: boolean }) => (
  <line
    className={cn(
      "stroke-gray8 stroke-1",
      dashed && "[stroke-dasharray:2_1]",
      className,
    )}
    {...props}
  />
);

const Path = (props: ComponentPropsWithoutRef<typeof motion.path>) => (
  <motion.path className="fill-none stroke-gray12 stroke-2" {...props} />
);

const Ball = (props: ComponentPropsWithoutRef<typeof motion.div>) => (
  <motion.div
    className="mx-auto aspect-square rounded-md border border-gray12 bg-[linear-gradient(45deg,var(--color-blue7),var(--color-blue5))] shadow-[3px_3px_0_var(--color-gray12)]"
    style={{ width: SQUARE_SIZE }}
    {...props}
  />
);
