import React from "react";
import { useMotionValue, animate, motion, useTransform } from "framer-motion";
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

export const CorrectedInverseAnimation = () => {
  const id = React.useId();

  const [isPlaying, setIsPlaying] = React.useState(false);
  const [showScaleRulers, setShowScaleRulers] = React.useState(false);
  const [initialWidth, setInitialWidth] = useSharedState(BASE_WIDTH);

  const width = useMotionValue(BASE_WIDTH);
  const y = useMotionValue(CONTENT_HEIGHT / 2 - BASE_WIDTH / 2);
  const squareLeftSide = useMotionValue(0);

  const lineRef = React.useRef<SVGLineElement>();

  React.useEffect(() => {
    setShowScaleRulers(false);
    width.set(initialWidth);
  }, [width, initialWidth]);

  React.useEffect(() => {
    y.set(CONTENT_HEIGHT / 2 - initialWidth / 2);
  }, [y, initialWidth]);

  const containerRef = React.useRef<HTMLDivElement>();
  const [containerWidth, setContainerWidth] = React.useState(0);

  React.useEffect(() => {
    setContainerWidth(containerRef.current?.getBoundingClientRect().width);
  }, []);

  React.useEffect(() => {
    squareLeftSide.set(containerWidth - initialWidth - PADDING);
  }, [squareLeftSide, containerWidth, initialWidth]);

  const to = PADDING;

  const squareCenter = {
    x: squareLeftSide,
    y,
  };

  React.useEffect(() => {
    return squareLeftSide.onChange((x) => {
      lineRef.current?.setAttribute("x2", x.toString());
    });
  }, [squareLeftSide]);

  React.useEffect(() => {
    return y.onChange((y) => {
      lineRef.current?.setAttribute("y2", y.toString());
    });
  }, [y]);

  return (
    <FullWidth>
      <Visualizer>
        <Content noOverflow ref={containerRef}>
          <ContentWrapper>
            <svg width="100%" height="100%">
              <mask id={`react-mask-${id}`}>
                <rect x="0" y="0" width="100%" height="100%" fill="black" />
                <motion.g style={squareCenter}>
                  <motion.rect
                    style={{ width, height: width }}
                    fill="white"
                    rx="6"
                  />
                </motion.g>
              </mask>
              <motion.g
                style={{ x: PADDING, y: CONTENT_HEIGHT / 2 - SQUARE_RADIUS }}
              >
                <SvgSquare width={SQUARE_RADIUS * 2} type="secondary" />
              </motion.g>
              <motion.g style={squareCenter}>
                <MotionSquare width={width} />
              </motion.g>
              <PatternMask maskId={`react-mask-${id}`} />
              {showScaleRulers ? (
                <motion.g style={{ x: squareLeftSide, y }}>
                  <ScaleRulers width={width} />
                </motion.g>
              ) : (
                <g>
                  <Line
                    ref={lineRef}
                    x1={to}
                    y1={CONTENT_HEIGHT / 2 - SQUARE_RADIUS}
                    y2="0"
                  />
                  <LineEndpoint
                    style={{ x: to, y: CONTENT_HEIGHT / 2 - SQUARE_RADIUS }}
                  />
                  <LineEndpoint style={{ x: squareLeftSide, y }} />
                </g>
              )}
            </svg>
          </ContentWrapper>
        </Content>
        <Controls>
          <ControlsWrapper>
            <IconButton
              onClick={() => {
                setIsPlaying(true);
                animate(1, 0, {
                  duration: 2.5,
                  onUpdate: (progress) => {
                    const startX = containerWidth - initialWidth - PADDING;
                    const endX = PADDING;
                    const currentX = (startX - endX) * progress + endX;
                    squareLeftSide.set(currentX);

                    const startY = CONTENT_HEIGHT / 2 - initialWidth / 2;
                    const endY = CONTENT_HEIGHT / 2 - SQUARE_RADIUS;
                    const currentY = (startY - endY) * progress + endY;
                    y.set(currentY);
                  },
                  onComplete: () => {
                    setShowScaleRulers(true);
                    animate(width, TARGET_WIDTH, {
                      duration: 1.5,
                      onUpdate: (width) => {
                        squareLeftSide.set(to + (initialWidth / 2 - width / 2));
                        y.set(
                          CONTENT_HEIGHT / 2 -
                            SQUARE_RADIUS +
                            (initialWidth / 2 - width / 2)
                        );
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

const PatternMask = ({ maskId }) => {
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
