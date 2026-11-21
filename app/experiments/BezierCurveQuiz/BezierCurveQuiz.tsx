import React from "react";
import {
  AnimationControls,
  motion,
  transform,
  useAnimationControls,
} from "framer-motion";
import { useDebouncedCallback } from "use-debounce";
import bezier from "bezier-easing";
import {
  Visualizer,
  Content,
  Controls,
  PlayButton,
  UndoButton,
  ToggleButton,
} from "~/components/Visualizer";
import { FullWidth } from "~/components/FullWidth";
import { cn } from "~/lib/cn";

import {
  EasingCurveEditor,
  viewbox,
  config,
  type CubicBezier,
} from "../EasingCurveEditor";
import { range, steppedRange } from "~/lib/utils";

const BASE_DURATION = 1;

export const BezierCurveQuiz = ({
  exampleEasing = [0.62, 0, 0.18, 1] as CubicBezier,
  debug = false,
}) => {
  const [speed, setSpeed] = React.useState(1);
  const container = React.useRef<HTMLDivElement>(null);
  const [easing, setEasing] = React.useState<CubicBezier>([0.25, 0.1, 0.25, 1]);
  const [showLine, setShowLine] = React.useState(debug);
  const width = useWidth(container);

  const controls = useAnimationControls();
  const exampleControls = useAnimationControls();

  const reset = async () => {
    await controls.start({ x: 0, transition: { type: false } });
    await exampleControls.start({
      x: 0,
      transition: { type: false },
    });
  };

  const target = width - 180;
  const play = async (speed: number) => {
    await reset();
    const duration = BASE_DURATION / speed;
    controls.start({
      x: target,
      transition: { duration, ease: easing },
    });
    exampleControls.start({
      x: target,
      transition: { duration, ease: exampleEasing },
    });
  };

  const debouncedPlay = useDebouncedCallback(() => play(speed), 500);
  const [x1, y1, x2, y2] = exampleEasing.map((n) => n * config.size);

  React.useEffect(() => {
    setShowLine(debug);
  }, [debug]);

  return (
    <FullWidth>
      <Visualizer childBorders={false} className="flex">
        <aside className="relative shrink-0 basis-[280px] border-r border-gray8">
          <EasingCurveEditor
            easing={easing}
            onEasingChange={(easing) => {
              setEasing(easing);
              debouncedPlay();
            }}
          />
          <div className="pointer-events-none absolute inset-0">
            <svg viewBox={viewbox}>
              <motion.path
                className="fill-none stroke-yellow8 stroke-3"
                d={`M 0 0 C ${x1} ${-y1} ${x2} ${-y2} ${config.size} -${
                  config.size
                }`}
                animate={{ pathLength: showLine ? 1 : 0 }}
                initial={{ pathLength: 0 }}
              />
            </svg>
          </div>
        </aside>
        <div className="w-full">
          <div className="flex h-[calc(100%-47px)] flex-col">
            <Animation
              easing={exampleEasing}
              controls={exampleControls}
              target={target}
              example
            />
            <Content ref={container} className="min-h-0 flex-1">
              <Animation easing={easing} controls={controls} target={target} />
            </Content>
          </div>
          <Controls className="border-t border-gray8">
            <div className="flex">
              <PlayButton onClick={() => play(speed)} />
              <UndoButton onClick={reset} />
            </div>
            <div className="flex">
              {[0.25, 0.5, 1].map((_speed) => (
                <ToggleButton
                  key={_speed}
                  secondary
                  onClick={() => {
                    setSpeed(_speed);
                    play(_speed);
                  }}
                  className={cn(
                    "font-bold font-mono text-gray11",
                    speed === _speed && "bg-gray7",
                  )}
                >
                  {_speed}x
                </ToggleButton>
              ))}
            </div>
            <ToggleButton onClick={() => setShowLine(true)}>Check</ToggleButton>
          </Controls>
        </div>
      </Visualizer>
    </FullWidth>
  );
};

const useWidth = (ref) => {
  const [width, setWidth] = React.useState(0);

  React.useEffect(() => {
    const handleResize = () => {
      setWidth(ref.current?.getBoundingClientRect().width);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [ref]);

  return width;
};

const SAMPLE_FPS = 12;

type AnimationProps = {
  controls: AnimationControls;
  easing: CubicBezier;
  example?: boolean;
  target: number;
};

const Animation = ({
  controls,
  easing,
  example = false,
  target,
}: AnimationProps) => {
  const easingCurve = bezier(...easing);
  const steps = steppedRange(0, BASE_DURATION, BASE_DURATION / SAMPLE_FPS).map(
    (current) => {
      const progress = current / BASE_DURATION;
      return easingCurve(progress) * target;
    },
  );
  const getOpacity = transform([0, target], [0.2, 0.6]);
  return (
    <div className="relative flex h-full flex-1 items-center px-10 last:border-t last:border-gray8">
      {steps.map((x) => (
        <motion.div
          key={x}
          style={{ x, "--opacity": getOpacity(x) } as React.CSSProperties}
          className={cn(
            "absolute aspect-square w-[100px] rounded-xl border-4 border-dashed opacity-50",
            example ? "border-yellow7" : "border-blue7",
          )}
        />
      ))}
      <motion.div
        animate={controls}
        className={cn(
          "relative aspect-square w-[100px] rounded-xl border border-gray12 shadow-[3px_3px_0_var(--color-gray12)]",
          example
            ? "bg-[linear-gradient(45deg,var(--color-yellow8),var(--color-yellow6))]"
            : "bg-[linear-gradient(45deg,var(--color-blue8),var(--color-blue6))]",
        )}
      />
    </div>
  );
};
