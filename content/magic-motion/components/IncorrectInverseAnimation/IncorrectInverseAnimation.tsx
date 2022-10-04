import React from "react";
import { useMotionValue, animate, motion, useTransform } from "framer-motion";
import { FaUndo } from "react-icons/fa";

import { styled } from "~/stitches.config";
import { FullWidth } from "~/components/FullWidth";
import { GridBackground } from "~/components/Grid";
import { Slider } from "~/components/Slider";

import { ToggleButton, Controls } from "../shared";
import { SvgSquare, SQUARE_RADIUS, BaseSvgSquare } from "../shared/styles";
import { Line, LineEndpoint } from "../shared/HorizontalRuler";

const CONTENT_HEIGHT = 300;
const MAX_HEIGHT_DELTA = 100;
const PADDING = 45;
const BASE_WIDTH = SQUARE_RADIUS * 2 + 50;

export const IncorrectInverseAnimation = () => {
  const x = useMotionValue(PADDING);
  const scale = useMotionValue(1);

  const containerRef = React.useRef<HTMLDivElement>();
  const [width, setWidth] = React.useState(BASE_WIDTH);
  const [containerWidth, setContainerWidth] = React.useState(0);
  const [showScale, setShowScale] = React.useState(false);

  const squareLeftSide = containerWidth - PADDING - width;

  const reset = React.useCallback(() => {
    x.set(squareLeftSide);
    scale.set(1);
    setShowScale(false);
  }, [x, scale, squareLeftSide]);

  React.useEffect(() => {
    setContainerWidth(containerRef.current?.getBoundingClientRect().width);
  }, []);

  React.useEffect(() => {
    reset();
  }, [reset]);

  const translateLineRef = React.useRef<SVGLineElement>();
  const translateEndpointRef = React.useRef<SVGCircleElement>();

  React.useEffect(() => {
    return x.onChange((currentX) => {
      translateLineRef.current?.setAttribute("x2", currentX.toString());
      translateEndpointRef.current?.setAttribute("cx", currentX.toString());
      squareRef.current?.setAttribute("x", currentX.toString());
      maskRef.current?.setAttribute("x", currentX.toString());
    });
  }, [x]);

  const scaleLineRef = React.useRef<SVGLineElement>();
  const scaleEndpointRef = React.useRef<SVGCircleElement>();

  const currentWidth = useTransform(scale, (scale) => width * scale);
  const lineY = useTransform(currentWidth, (width) => -width / 2);
  const lineX = useTransform(scale, (scale) => (width / 2) * scale + width / 2);

  React.useEffect(() => {
    return lineY.onChange((y) => {
      scaleLineRef.current?.setAttribute("y2", y.toString());
      scaleEndpointRef.current?.setAttribute("cy", y.toString());
    });
  }, [lineY]);

  React.useEffect(() => {
    return lineX.onChange((x) => {
      scaleLineRef.current?.setAttribute("x2", x.toString());
      scaleEndpointRef.current?.setAttribute("cx", x.toString());
    });
  }, [lineX]);

  const squareRef = React.useRef<SVGRectElement>();
  const maskRef = React.useRef<SVGRectElement>();

  React.useEffect(() => {
    return currentWidth.onChange((width) => {
      squareRef.current?.setAttribute("width", width.toString());
      squareRef.current?.setAttribute("height", width.toString());
      maskRef.current?.setAttribute("width", width.toString());
      maskRef.current?.setAttribute("height", width.toString());
    });
  }, [currentWidth]);

  const squareY = useTransform(
    currentWidth,
    (currentWidth) => CONTENT_HEIGHT / 2 - currentWidth / 2
  );

  React.useEffect(() => {
    return squareY.onChange((y) => {
      squareRef.current?.setAttribute("y", y.toString());
      maskRef.current?.setAttribute("y", y.toString());
    });
  }, [squareY]);

  const squareX = useTransform(scale, (scale) => {
    const currentWidth = width * scale;
    return (width / 2) * scale + width / 2 + PADDING - currentWidth;
  });

  React.useEffect(() => {
    return squareX.onChange((x) => {
      squareRef.current?.setAttribute("x", x.toString());
      maskRef.current?.setAttribute("x", x.toString());
    });
  }, [squareX]);

  return (
    <FullWidth>
      <Controls>
        <ToggleButton
          onClick={() => {
            animate(x, PADDING, {
              duration: 3,
              onComplete: () => {
                setShowScale(true);
                animate(scale, (SQUARE_RADIUS * 2) / width, { duration: 1.5 });
              },
            });
          }}
        >
          Play
        </ToggleButton>
        <UndoButton
          onClick={() => {
            reset();
            setWidth(BASE_WIDTH);
          }}
        >
          <FaUndo />
        </UndoButton>
      </Controls>
      <GridBackground noOverflow>
        <ContentWrapper ref={containerRef}>
          <svg width="100%" height="100%">
            <mask id="rect-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="black" />
              <rect
                ref={maskRef}
                width={width}
                height={width}
                y={CONTENT_HEIGHT / 2 - width / 2}
                fill="white"
                rx="6"
              />
            </mask>
            <defs>
              <pattern
                id="pattern"
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45 50 50)"
              >
                <line stroke="var(--colors-blue6)" strokeWidth="10" y2="10" />
              </pattern>
            </defs>
            <SvgSquare
              width={SQUARE_RADIUS * 2}
              type="secondary"
              x={PADDING}
              y={CONTENT_HEIGHT / 2 - SQUARE_RADIUS}
            />
            <BaseSvgSquare
              ref={squareRef}
              width={width}
              height={width}
              y={CONTENT_HEIGHT / 2 - width / 2}
            />
            <rect
              width={SQUARE_RADIUS * 2}
              height={SQUARE_RADIUS * 2}
              x={PADDING}
              y={CONTENT_HEIGHT / 2 - SQUARE_RADIUS}
              rx="6"
              fill="url(#pattern)"
              stroke="var(--colors-blue7)"
              mask="url(#rect-mask)"
            />
            {showScale ? (
              <motion.g
                style={{
                  y: CONTENT_HEIGHT / 2,
                  x,
                }}
              >
                <Line
                  ref={scaleLineRef}
                  x1={width / 2}
                  x2={width}
                  y1="0"
                  y2={-(width / 2)}
                />
                <LineEndpoint cx={width / 2} cy="0" />
                <LineEndpoint
                  cx={width}
                  cy={-(width / 2)}
                  ref={scaleEndpointRef}
                />
              </motion.g>
            ) : (
              <g style={{ transform: `translateY(${CONTENT_HEIGHT / 2}px)` }}>
                <Line
                  ref={translateLineRef}
                  x1={PADDING}
                  y1="0"
                  y2="0"
                  x2={squareLeftSide}
                />
                <LineEndpoint
                  ref={translateEndpointRef}
                  cx={squareLeftSide}
                  cy="0"
                />
                <LineEndpoint cx={PADDING} cy="0" />
              </g>
            )}
          </svg>
        </ContentWrapper>
      </GridBackground>
      <WidthSlider
        value={[width]}
        onValueChange={([newWidth]) => setWidth(newWidth)}
        max={SQUARE_RADIUS * 2 + MAX_HEIGHT_DELTA}
        min={SQUARE_RADIUS * 2 - MAX_HEIGHT_DELTA}
        step={1}
      />
    </FullWidth>
  );
};

const WidthSlider = styled(Slider, {
  marginTop: "$6",
});

const UndoButton = styled(ToggleButton, {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "$gray10",
  height: 22,
});

const ContentWrapper = styled("div", {
  height: CONTENT_HEIGHT,
});
