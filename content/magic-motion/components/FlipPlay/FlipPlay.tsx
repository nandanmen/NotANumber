import React from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";

import { FullWidth } from "~/components/FullWidth";
import {
  Visualizer,
  Content,
  Controls,
  UndoButton,
  PlayButton,
} from "~/components/Visualizer";
import { styled } from "~/stitches.config";

import { SvgSquare, PADDING, SQUARE_RADIUS } from "../shared/styles";

const CONTENT_HEIGHT = 300;

export const FlipPlay = () => {
  const x = useMotionValue(0);
  const squareTranslateX = useTransform(x, (val) => -(SQUARE_RADIUS * 2) + val);
  const textTranslateX = useTransform(squareTranslateX, (val) => val - PADDING);

  // -- width

  const [width, setWidth] = React.useState(0);
  const widthRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setWidth(widthRef.current?.offsetWidth);
  }, []);

  // --

  const distance = width - PADDING - SQUARE_RADIUS * 2 - PADDING;
  React.useEffect(() => x.set(-1 * distance), [x, distance]);

  const lineRef = React.useRef<SVGLineElement>();
  const textRef = React.useRef<SVGTextElement>();
  React.useEffect(() => {
    return x.onChange((val) => {
      lineRef.current?.setAttribute(
        "x1",
        `${(SQUARE_RADIUS + PADDING) * 2 + val + distance}`
      );
      textRef.current.textContent = `translateX(${val.toFixed(0)}px)`;
    });
  }, [x, distance]);

  const finalBoxX = width - SQUARE_RADIUS * 2 - PADDING;
  const textY = CONTENT_HEIGHT / 2 - SQUARE_RADIUS - 15;

  return (
    <FullWidth>
      <Visualizer>
        <ContentWrapper noOverflow ref={widthRef}>
          <svg width="100%" height="100%">
            <Square x={PADDING} type="secondary" />
            <TranslateText
              x={PADDING}
              y={CONTENT_HEIGHT / 2 - SQUARE_RADIUS - 15}
            >
              x: {PADDING}
            </TranslateText>
            <Square x={finalBoxX} type="secondary" />
            <AnchorLine
              ref={lineRef}
              x1={PADDING + SQUARE_RADIUS * 2}
              x2={width}
              y1={CONTENT_HEIGHT / 2}
              y2={CONTENT_HEIGHT / 2}
              style={{
                transform: `translateX(-${SQUARE_RADIUS + PADDING}px)`,
              }}
            />
            {width && (
              <motion.g
                style={{
                  x: width - SQUARE_RADIUS - PADDING,
                  y: CONTENT_HEIGHT / 2,
                }}
              >
                <AnchorCircle cy="0" cx="0" style={{ rotate: x }} />
              </motion.g>
            )}
            <Square
              x={width - PADDING}
              style={{ translateX: squareTranslateX }}
            />
            <TranslateText x={finalBoxX} y={textY}>
              x: {finalBoxX}
            </TranslateText>
            <TranslateText
              ref={textRef}
              style={{
                translateX: textTranslateX,
              }}
              x={width}
              y={CONTENT_HEIGHT / 2 + SQUARE_RADIUS + 25}
            >
              translateX({-distance}px)
            </TranslateText>
          </svg>
        </ContentWrapper>
        <Controls css={{ alignItems: "center" }}>
          <PlayButton onClick={() => animate(x, 0, { duration: 3 })} />
          <UndoButton onClick={() => x.set(-1 * distance)} />
        </Controls>
      </Visualizer>
    </FullWidth>
  );
};

const TranslateText = styled(motion.text, {
  fontFamily: "$mono",
  fontSize: "$sm",
});

const ContentWrapper = styled(Content, {
  height: CONTENT_HEIGHT,
});

const AnchorCircle = styled(motion.circle, {
  fill: "$gray5",
  stroke: "$gray8",
  strokeWidth: 2,
  strokeDasharray: "12 2",
  r: "10px",
});

const AnchorLine = styled("line", {
  stroke: "$gray8",
  strokeWidth: 2,
});

const Square = styled(SvgSquare, {
  width: SQUARE_RADIUS * 2,
  y: CONTENT_HEIGHT / 2 - SQUARE_RADIUS,
});
