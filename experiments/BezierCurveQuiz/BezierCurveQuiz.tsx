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
import { styled } from "~/stitches.config";

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
      <Visualizer childBorders={false} css={{ display: "flex" }}>
        <Aside>
          <EasingCurveEditor
            easing={easing}
            onEasingChange={(easing) => {
              setEasing(easing);
              debouncedPlay();
            }}
          />
          <SvgCheckWrapper>
            <svg viewBox={viewbox}>
              <ExamplePath
                d={`M 0 0 C ${x1} ${-y1} ${x2} ${-y2} ${config.size} -${
                  config.size
                }`}
                animate={{ pathLength: showLine ? 1 : 0 }}
                initial={{ pathLength: 0 }}
              />
            </svg>
          </SvgCheckWrapper>
        </Aside>
        <ContentWrapper>
          <AnimationStack>
            <Animation
              easing={exampleEasing}
              controls={exampleControls}
              target={target}
              example
            />
            <Content ref={container} css={{ flex: 1 }}>
              <Animation easing={easing} controls={controls} target={target} />
            </Content>
          </AnimationStack>
          <Controls css={{ borderTop: "1px solid $gray8 !important" }}>
            <Stack>
              <PlayButton onClick={() => play(speed)} />
              <UndoButton onClick={reset} />
            </Stack>
            <Stack>
              {[0.25, 0.5, 1].map((_speed) => (
                <Button
                  key={_speed}
                  secondary
                  onClick={() => {
                    setSpeed(_speed);
                    play(_speed);
                  }}
                  active={speed === _speed}
                >
                  {_speed}x
                </Button>
              ))}
            </Stack>
            <ToggleButton onClick={() => setShowLine(true)}>Check</ToggleButton>
          </Controls>
        </ContentWrapper>
      </Visualizer>
    </FullWidth>
  );
};

const ExamplePath = styled(motion.path, {
  fill: "none",
  strokeWidth: 3,
  stroke: "$yellow8",
});

const SvgCheckWrapper = styled("div", {
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
});

const AnimationStack = styled("div", {
  display: "flex",
  flexDirection: "column",
  height: "calc(100% - 47px)",
});

const Button = styled(ToggleButton, {
  fontWeight: "bold",
  fontFamily: "$mono",
  color: "$gray11",

  variants: {
    active: {
      true: {
        background: "$gray7",
      },
    },
  },
});

const Stack = styled("div", {
  display: "flex",
});

const ContentWrapper = styled("div", {
  width: "100%",
});

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
    }
  );
  const getOpacity = transform([0, target], [0.2, 0.6]);
  return (
    <AnimationWrapper>
      {steps.map((x) => (
        <Shadow
          key={x}
          style={{ x, "--opacity": getOpacity(x) } as React.CSSProperties}
          example={example}
        />
      ))}
      <Square animate={controls} example={example} />
    </AnimationWrapper>
  );
};

const AnimationWrapper = styled("div", {
  padding: "0 $10",
  display: "flex",
  alignItems: "center",
  flex: 1,
  height: "100%",
  position: "relative",

  "&:last-child": {
    borderTop: "1px solid $gray8",
  },
});

const Shadow = styled(motion.div, {
  position: "absolute",
  width: 100,
  aspectRatio: 1,
  border: "4px dashed $blue7",
  borderRadius: 12,
  opacity: 0.5,

  variants: {
    example: {
      true: {
        borderColor: "$yellow7",
      },
    },
  },
});

const Square = styled(motion.div, {
  width: 100,
  aspectRatio: 1,
  background: "linear-gradient(45deg, $blue8, $blue6)",
  border: "1px solid $gray12",
  borderRadius: 12,
  boxShadow: "3px 3px 0 $colors$gray12",
  position: "relative",

  variants: {
    example: {
      true: {
        background: "linear-gradient(45deg, $yellow8, $yellow6)",
      },
    },
  },
});

const Aside = styled("aside", {
  flexBasis: 280,
  flexShrink: 0,
  borderRight: "1px solid $gray8",
  position: "relative",
});
