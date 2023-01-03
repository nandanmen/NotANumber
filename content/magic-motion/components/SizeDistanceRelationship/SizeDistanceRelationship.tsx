import React from "react";

import { styled } from "~/stitches.config";
import { FullWidth } from "~/components/FullWidth";
import { Content, Visualizer, Controls } from "~/components/Visualizer";

import { Counter } from "~/components/Counter";
import { SvgSquare, SQUARE_RADIUS, BaseSvgSquare } from "../shared/styles";
import { HorizontalRuler } from "../shared/HorizontalRuler";

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
        <ContentWrapper ref={containerRef} noOverflow>
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
        <ContentWrapper noOverflow>
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
