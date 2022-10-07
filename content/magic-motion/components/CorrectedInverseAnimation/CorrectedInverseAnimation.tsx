import React from "react";
import { useMotionValue, animate, motion, useTransform } from "framer-motion";
import { FaUndo, FaPlay } from "react-icons/fa";

import { styled } from "~/stitches.config";
import { FullWidth } from "~/components/FullWidth";
import { Slider } from "~/components/Slider";
import { GridBackground } from "~/components/Grid";
import { useSharedState } from "~/components/SharedState";

import { SvgSquare, SQUARE_RADIUS } from "../shared/styles";
import { MotionSquare, ScaleRulers } from "../MotionSquare";
import { Line, LineEndpoint } from "../shared/HorizontalRuler";

const CONTENT_HEIGHT = 300;
const MAX_HEIGHT_DELTA = 100;
const PADDING = 45;
const BASE_WIDTH = SQUARE_RADIUS * 2 + 50;
const TARGET_WIDTH = SQUARE_RADIUS * 2;

export const CorrectedInverseAnimation = ({ corrected = false }) => {
  const id = React.useId();

  const [isPlaying, setIsPlaying] = React.useState(false);
  const [showScaleRulers, setShowScaleRulers] = React.useState(false);
  const [initialWidth, setInitialWidth] = useSharedState(BASE_WIDTH);
  const width = useMotionValue(BASE_WIDTH);
  const lineRef = React.useRef<SVGLineElement>();

  React.useEffect(() => {
    setShowScaleRulers(false);
    width.set(initialWidth);
  }, [width, initialWidth]);

  const containerRef = React.useRef<HTMLDivElement>();
  const [containerWidth, setContainerWidth] = React.useState(0);

  React.useEffect(() => {
    setContainerWidth(containerRef.current?.getBoundingClientRect().width);
  }, []);

  const to = corrected ? PADDING + SQUARE_RADIUS - initialWidth / 2 : PADDING;

  const squareLeftSide = useTransform(
    width,
    (width) => containerWidth - width - PADDING
  );
  const xOffset = useTransform(
    width,
    (width) => to + (initialWidth / 2 - width / 2)
  );
  const y = useTransform(width, (width) => CONTENT_HEIGHT / 2 - width / 2);
  const squareCenter = useTransform(
    squareLeftSide,
    (x) => x + initialWidth / 2
  );

  React.useEffect(() => {
    if (corrected) {
      return squareCenter.onChange((x) => {
        lineRef.current?.setAttribute("x2", x.toString());
      });
    }
  }, [squareCenter, corrected]);

  React.useEffect(() => {
    if (!corrected) {
      return squareLeftSide.onChange((x) => {
        lineRef.current?.setAttribute("x2", x.toString());
      });
    }
  }, [squareLeftSide, corrected]);

  return (
    <FullWidth>
      <FigureWrapper>
        <Visualization noOverflow ref={containerRef}>
          <ContentWrapper>
            <svg width="100%" height="100%">
              <mask id={`react-mask-${id}`}>
                <rect x="0" y="0" width="100%" height="100%" fill="black" />
                <motion.g
                  style={{ x: showScaleRulers ? xOffset : squareLeftSide, y }}
                >
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
              <motion.g
                style={{ x: showScaleRulers ? xOffset : squareLeftSide, y }}
              >
                <MotionSquare width={width} />
              </motion.g>
              <PatternMask maskId={`react-mask-${id}`} />
              {showScaleRulers ? (
                <motion.g style={{ x: xOffset, y }}>
                  <ScaleRulers width={width} />
                </motion.g>
              ) : (
                <motion.g style={{ y: CONTENT_HEIGHT / 2 }}>
                  <Line
                    ref={lineRef}
                    x1={corrected ? to + initialWidth / 2 : to}
                    y1="0"
                    y2="0"
                  />
                  <LineEndpoint
                    style={{ x: corrected ? to + initialWidth / 2 : to }}
                  />
                  <LineEndpoint
                    style={{ x: corrected ? squareCenter : squareLeftSide }}
                  />
                </motion.g>
              )}
            </svg>
          </ContentWrapper>
        </Visualization>
        <Controls>
          <IconButton
            onClick={() => {
              setIsPlaying(true);
              animate(squareLeftSide, to, {
                duration: 2.5,
                onComplete: () => {
                  setShowScaleRulers(true);
                  animate(width, TARGET_WIDTH, {
                    duration: 1.5,
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
        </Controls>
      </FigureWrapper>
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

const Visualization = styled(GridBackground, {
  border: "none",
  borderRadius: "none",
});

const FigureWrapper = styled("div", {
  border: "1px solid $gray8",
  borderRadius: "$base",
  overflow: "hidden",
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

const Controls = styled("div", {
  padding: "$2",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "$4",
  borderTop: "1px solid $gray8",
  background: "$gray5",
  position: "relative",
});
