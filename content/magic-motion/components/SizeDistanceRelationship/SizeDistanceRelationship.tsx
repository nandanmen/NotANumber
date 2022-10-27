import React from "react";

import { styled } from "~/stitches.config";
import { FullWidth } from "~/components/FullWidth";
import { Content, Visualizer, Controls } from "~/components/Visualizer";

import { Counter } from "../shared";
import { SvgSquare, SQUARE_RADIUS, BaseSvgSquare } from "../shared/styles";

const BASE_WIDTH = SQUARE_RADIUS * 2;
const CONTENT_HEIGHT = 300;
const MAX_HEIGHT_DELTA = 60;
const PADDING = 32;

export const SizeDistanceRelationship = () => {
  const containerRef = React.useRef<HTMLDivElement>();
  const [width, setWidth] = React.useState(BASE_WIDTH);
  const [containerWidth, setContainerWidth] = React.useState(0);

  React.useEffect(() => {
    setContainerWidth(containerRef.current?.getBoundingClientRect().width);
  }, []);

  const squareLeftSide = containerWidth - PADDING - width;

  return (
    <FullWidth>
      <Visualizer>
        <Controls css={{ justifyContent: "center" }}>
          <Counter
            value={width}
            onChange={setWidth}
            min={BASE_WIDTH - MAX_HEIGHT_DELTA}
            max={BASE_WIDTH + MAX_HEIGHT_DELTA}
            step={20}
          />
        </Controls>
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
              x={squareLeftSide}
              y={CONTENT_HEIGHT / 2 - width / 2}
            />
            <g
              style={{
                transform: `translateY(${
                  CONTENT_HEIGHT / 2 - SQUARE_RADIUS
                }px)`,
              }}
            >
              <HorizontalRuler
                from={PADDING}
                to={PADDING + SQUARE_RADIUS * 2}
                small
              />
            </g>
            <g style={{ transform: `translateY(${CONTENT_HEIGHT / 2}px)` }}>
              <HorizontalRuler from={PADDING} to={squareLeftSide} />
            </g>
            <g
              style={{
                transform: `translateY(${CONTENT_HEIGHT / 2 - width / 2}px)`,
              }}
            >
              <HorizontalRuler
                from={squareLeftSide}
                to={squareLeftSide + width}
                showLine={false}
                small
              />
            </g>
          </svg>
        </ContentWrapper>
        <ContentWrapper>
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
              x={squareLeftSide}
              y={CONTENT_HEIGHT / 2 - width / 2}
            />
            <g
              style={{
                transform: `translateY(${
                  CONTENT_HEIGHT / 2 - SQUARE_RADIUS
                }px)`,
              }}
            >
              <HorizontalRuler
                from={PADDING}
                to={PADDING + SQUARE_RADIUS * 2}
                small
              />
            </g>
            <g style={{ transform: `translateY(${CONTENT_HEIGHT / 2}px)` }}>
              <HorizontalRuler
                from={PADDING + SQUARE_RADIUS}
                to={squareLeftSide + width / 2}
              />
            </g>
            <g
              style={{
                transform: `translateY(${CONTENT_HEIGHT / 2 - width / 2}px)`,
              }}
            >
              <HorizontalRuler
                from={squareLeftSide}
                to={squareLeftSide + width}
                showLine={false}
                small
              />
            </g>
          </svg>
        </ContentWrapper>
      </Visualizer>
    </FullWidth>
  );
};

const ContentWrapper = styled(Content, {
  height: 300,
});

const HorizontalRuler = ({ from, to, showLine = true, small = false }) => {
  const distance = to - from;
  return (
    <g>
      {showLine && <Line x1={from} x2={to} y1="0" y2="0" />}
      <LineEndpoint cx={from} small={small} />
      <LineEndpoint cx={to} small={small} />
      <g style={{ transform: `translateX(${(to - from) / 2 + from}px)` }}>
        <RulerTextBackground small={small} />
        <RulerText
          x="0"
          textAnchor="middle"
          alignmentBaseline="central"
          small={small}
        >
          {distance.toFixed(1)}
        </RulerText>
      </g>
    </g>
  );
};

const RulerTextBackground = styled("rect", {
  width: 60,
  fill: "$blue2",
  height: 30,
  rx: 4,
  stroke: "$blue8",
  x: -30,
  y: -15,

  variants: {
    small: {
      true: {
        width: 50,
        height: 25,
        x: -25,
        y: -12.5,
      },
    },
  },
});

const RulerText = styled("text", {
  fill: "$blue10",
  fontFamily: "$mono",
  fontSize: "$sm",

  variants: {
    small: {
      true: {
        fontSize: 12,
      },
    },
  },
});

const Line = styled("line", {
  stroke: "$blue8",
  strokeDasharray: "4",
});

const LineEndpoint = styled("circle", {
  cy: 0,
  r: 6,
  fill: "$blue2",
  stroke: "$blue8",

  variants: {
    small: {
      true: {
        r: 4,
      },
    },
  },
});
