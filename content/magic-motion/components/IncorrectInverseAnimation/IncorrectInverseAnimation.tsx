import React from "react";
import { useMotionValue, animate, motion } from "framer-motion";
import { FaUndo } from "react-icons/fa";

import { styled } from "~/stitches.config";
import { FullWidth } from "~/components/FullWidth";
import { GridBackground } from "~/components/Grid";
import { Slider } from "~/components/Slider";

import { ToggleButton, Controls } from "../shared";
import { SvgSquare, SQUARE_RADIUS, BaseSvgSquare } from "../shared/styles";
import { Line, LineEndpoint } from "../shared/HorizontalRuler";

const BASE_WIDTH = SQUARE_RADIUS * 2;
const CONTENT_HEIGHT = 350;
const MAX_HEIGHT_DELTA = 50;
const PADDING = 45;

export const IncorrectInverseAnimation = () => {
  const x = useMotionValue(PADDING);
  const scale = useMotionValue(1);

  const containerRef = React.useRef<HTMLDivElement>();
  const [width, setWidth] = React.useState(BASE_WIDTH);
  const [containerWidth, setContainerWidth] = React.useState(0);
  const [showScale, setShowScale] = React.useState(true);

  const squareLeftSide = containerWidth - PADDING - width;

  const reset = React.useCallback(() => {
    // x.set(squareLeftSide);
    scale.set(1);
    // setShowScale(false);
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
    x.onChange((currentX) => {
      translateLineRef.current?.setAttribute("x2", currentX.toString());
      translateEndpointRef.current?.setAttribute("cx", currentX.toString());
    });
  }, [x]);

  const scaleLineRef = React.useRef<SVGLineElement>();
  const scaleEndpointRef = React.useRef<SVGCircleElement>();

  React.useEffect(() => {
    scale.onChange((currentScale) => {
      scaleLineRef.current?.setAttribute(
        "y2",
        (-(width * currentScale) / 2).toString()
      );
      scaleLineRef.current?.setAttribute(
        "x2",
        (width * currentScale + 15).toString()
      );
      scaleEndpointRef.current?.setAttribute(
        "cy",
        (-(width * currentScale) / 2).toString()
      );
      scaleEndpointRef.current?.setAttribute(
        "cx",
        (width * currentScale + 15).toString()
      );
    });
  }, [scale, width]);

  return (
    <FullWidth>
      <Slider
        value={[width]}
        onValueChange={([newWidth]) => setWidth(newWidth)}
        max={BASE_WIDTH + MAX_HEIGHT_DELTA}
        min={BASE_WIDTH - MAX_HEIGHT_DELTA}
        step={1}
      />
      <Controls>
        <ToggleButton
          onClick={() => {
            animate(scale, BASE_WIDTH / width, { duration: 1.5 });
            /* animate(x, PADDING, {
              duration: 3,
              onComplete: () => {
                setShowScale(true);
                animate(scale, BASE_WIDTH / width, { duration: 1.5 });
              },
            }); */
          }}
        >
          Play
        </ToggleButton>
        <UndoButton onClick={reset}>
          <FaUndo />
        </UndoButton>
      </Controls>
      <GridBackground noOverflow>
        <ContentWrapper ref={containerRef}>
          <svg width="100%" height="100%">
            <SvgSquare
              width={SQUARE_RADIUS * 2}
              type="secondary"
              x={PADDING}
              y={CONTENT_HEIGHT / 2 - SQUARE_RADIUS}
            />
            <BaseSvgSquare
              width={width}
              height={width}
              y={CONTENT_HEIGHT / 2 - width / 2}
              style={{
                x,
                scale,
              }}
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
    </FullWidth>
  );
};

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
