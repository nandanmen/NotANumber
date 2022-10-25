import React from "react";
import {
  useMotionValue,
  animate,
  motion,
  MotionValue,
  useTransform,
} from "framer-motion";
import { FaUndo, FaPlay } from "react-icons/fa";

import { styled } from "~/stitches.config";
import { FullWidth } from "~/components/FullWidth";
import { Slider } from "~/components/Slider";
import { useSharedState } from "~/components/SharedState";
import { Visualizer, Content, Controls } from "~/components/Visualizer";

import { SvgSquare, SQUARE_RADIUS } from "../shared/styles";
import { MotionSquare, ScaleRulers } from "../MotionSquare";
import { Line, LineEndpoint } from "../shared/HorizontalRuler";

const CONTENT_HEIGHT = 300;
const MAX_HEIGHT_DELTA = 100;
const PADDING = 45;
const BASE_WIDTH = SQUARE_RADIUS * 2 + 50;
const TARGET_WIDTH = SQUARE_RADIUS * 2;

const ORIGIN_TOP_LEFT = {
  x: PADDING,
  y: CONTENT_HEIGHT / 2 - SQUARE_RADIUS,
};

const mapOriginToOffset = {
  center: ({ width, initialWidth }) => {
    return {
      x: initialWidth / 2 - width / 2,
      y: initialWidth / 2 - width / 2,
    };
  },
  topLeft: () => {
    return { x: 0, y: 0 };
  },
} as const;

type Container = { width: number; height: number; padding: number };

type Position = { x: number; y: number };

type CorrectedInverseAnimationProps = {
  from: (width: number, container: Container) => Position;
  to: (width: number, container: Container) => Position;
  origin?: keyof typeof mapOriginToOffset;
};

export const CorrectedInverseAnimation = ({
  from,
  to,
  origin = "center",
}: CorrectedInverseAnimationProps) => {
  const id = React.useId();

  const [isPlaying, setIsPlaying] = React.useState(false);
  const [showScaleRulers, setShowScaleRulers] = React.useState(false);
  const [initialWidth, setInitialWidth] = useSharedState(BASE_WIDTH);

  // -- measuring container width --

  const containerRef = React.useRef<HTMLDivElement>();
  const [containerWidth, setContainerWidth] = React.useState(0);

  React.useEffect(() => {
    setContainerWidth(containerRef.current?.getBoundingClientRect().width);
  }, []);

  // --

  const container = {
    width: containerWidth,
    height: CONTENT_HEIGHT,
    padding: PADDING,
  };

  const fromPos = from(initialWidth, container);
  const targetPos = to(SQUARE_RADIUS * 2, container);

  const width = useMotionValue(BASE_WIDTH);

  const squareY = useMotionValue(CONTENT_HEIGHT / 2 - BASE_WIDTH / 2);
  const squareX = useMotionValue(0);

  const topLeftX = containerWidth - initialWidth - PADDING;
  const topLeftY = CONTENT_HEIGHT / 2 - initialWidth / 2;

  const deltaX = fromPos.x - topLeftX;
  const deltaY = fromPos.y - topLeftY;

  React.useEffect(() => {
    setShowScaleRulers(false);
    width.set(initialWidth);
  }, [width, initialWidth]);

  React.useEffect(() => {
    squareY.set(topLeftY);
  }, [squareY, topLeftY]);

  React.useEffect(() => {
    squareX.set(topLeftX);
  }, [squareX, topLeftX]);

  const squarePos = { x: squareX, y: squareY };

  const fromX = useTransform(squareX, (x) => x + deltaX);
  const fromY = useTransform(squareY, (y) => y + deltaY);

  return (
    <FullWidth>
      <Visualizer>
        <Content noOverflow ref={containerRef}>
          <ContentWrapper>
            <svg width="100%" height="100%">
              <mask id={`react-mask-${id}`}>
                <rect x="0" y="0" width="100%" height="100%" fill="black" />
                <motion.g style={squarePos}>
                  <motion.rect
                    style={{ width, height: width }}
                    fill="white"
                    rx="6"
                  />
                </motion.g>
              </mask>
              <motion.g style={ORIGIN_TOP_LEFT}>
                <SvgSquare width={SQUARE_RADIUS * 2} type="secondary" />
              </motion.g>
              <motion.g style={squarePos}>
                <MotionSquare width={width} />
              </motion.g>
              <PatternMask maskId={`react-mask-${id}`} />
              {showScaleRulers ? (
                <motion.g style={{ x: squareX, y: squareY }}>
                  <ScaleRulers width={width} topLeft={origin === "topLeft"} />
                </motion.g>
              ) : (
                <g>
                  <DistanceRuler
                    x1={targetPos.x}
                    x2={fromX}
                    y1={targetPos.y}
                    y2={fromY}
                  />
                  <LineEndpoint style={{ x: targetPos.x, y: targetPos.y }} />
                  <LineEndpoint style={{ x: fromX, y: fromY }} />
                </g>
              )}
            </svg>
          </ContentWrapper>
        </Content>
        <Controls>
          <ControlsWrapper>
            <IconButton
              onClick={() => {
                setShowScaleRulers(false);
                width.set(initialWidth);

                setIsPlaying(true);
                animate(1, 0, {
                  duration: 2.5,
                  onUpdate: (progress) => {
                    const { x: endX, y: endY } = targetPos;
                    const { x: fromX, y: fromY } = fromPos;

                    const currentX = (fromX - endX) * progress + endX;
                    squareX.set(currentX - deltaX);

                    const currentY = (fromY - endY) * progress + endY;
                    squareY.set(currentY - deltaY);
                  },
                  onComplete: () => {
                    setShowScaleRulers(true);
                    animate(width, TARGET_WIDTH, {
                      duration: 1.5,
                      onUpdate: (width) => {
                        const x = targetPos.x - deltaX;
                        const y = targetPos.y - deltaY;
                        const offset = mapOriginToOffset[origin]({
                          width,
                          initialWidth,
                        });
                        squareX.set(x + offset.x);
                        squareY.set(y + offset.y);
                      },
                      onComplete: () => setIsPlaying(false),
                    });
                  },
                });
              }}
            >
              <FaPlay />
            </IconButton>
            <Slider
              value={[initialWidth]}
              onValueChange={([newWidth]) => {
                setInitialWidth(newWidth);
              }}
              max={TARGET_WIDTH + MAX_HEIGHT_DELTA}
              min={TARGET_WIDTH - MAX_HEIGHT_DELTA}
              step={1}
            />
            <IconButton
              onClick={() => {
                setShowScaleRulers(false);
                setInitialWidth(BASE_WIDTH);
                squareX.set(containerWidth - BASE_WIDTH - PADDING);
                squareY.set(CONTENT_HEIGHT / 2 - BASE_WIDTH / 2);
                width.set(BASE_WIDTH);
              }}
            >
              <FaUndo />
            </IconButton>
            {isPlaying && <DisabledOverlay />}
          </ControlsWrapper>
        </Controls>
      </Visualizer>
    </FullWidth>
  );
};

type DistanceRulerProps = {
  x1: number;
  y1: number;
  x2: MotionValue<number>;
  y2: MotionValue<number>;
};

const DistanceRuler = ({ x1, y1, x2, y2 }: DistanceRulerProps) => {
  const lineRef = React.useRef<SVGLineElement>();

  React.useEffect(() => {
    return x2.onChange((x) => {
      lineRef.current?.setAttribute("x2", x.toString());
    });
  }, [x2]);

  React.useEffect(() => {
    return y2.onChange((y) => {
      lineRef.current?.setAttribute("y2", y.toString());
    });
  }, [y2]);

  return <Line ref={lineRef} x1={x1} x2={x2.get()} y1={y1} y2={y2.get()} />;
};

const PatternMask = ({ maskId }: { maskId: string }) => {
  return (
    <>
      <defs>
        <pattern
          id="pattern"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45 50 50)"
        >
          <StripeLine y2="10" />
        </pattern>
      </defs>
      <StripedSquare mask={`url(#${maskId})`} />
    </>
  );
};

const DisabledOverlay = styled("div", {
  position: "absolute",
  inset: 0,
  backgroundColor: "rgba(0, 0, 0, 0.05)",
  cursor: "not-allowed",
});

const ContentWrapper = styled("div", {
  height: CONTENT_HEIGHT,
});

const StripedSquare = styled("rect", {
  width: SQUARE_RADIUS * 2,
  height: SQUARE_RADIUS * 2,
  x: PADDING,
  y: CONTENT_HEIGHT / 2 - SQUARE_RADIUS,
  rx: 6,
  fill: "url(#pattern)",
  stroke: "$blue6",
});

const StripeLine = styled("line", {
  stroke: "$blue6",
  strokeWidth: 10,
});

const IconButton = styled("button", {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "$gray9",
  padding: "$2",
  borderRadius: "$base",

  "&:hover": {
    background: "$gray6",
  },
});

const ControlsWrapper = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "$4",
});
