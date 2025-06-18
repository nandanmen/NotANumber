import React from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";

import { FullWidth } from "~/components/FullWidth";
import {
  Visualizer,
  Content,
  Controls,
  UndoButton,
  ToggleButton,
} from "~/components/Visualizer";
import { styled, darkTheme } from "~/stitches.config";

import { SvgSquare, PADDING, SQUARE_RADIUS } from "../shared/styles";

const CONTENT_HEIGHT = 300;

export const FlipInverse = () => {
  const x = useMotionValue(0);
  const squareTranslateX = useTransform(x, (val) => -(SQUARE_RADIUS * 2) + val);

  // -- width

  const [width, setWidth] = React.useState(0);
  const widthRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setWidth(widthRef.current?.offsetWidth);
  }, []);

  // --

  const distance = width - PADDING - SQUARE_RADIUS * 2 - PADDING;
  const textTranslateX = useTransform(x, (val) => val + PADDING + distance);

  const lineRef = React.useRef<SVGLineElement>(null);
  const textRef = React.useRef<SVGTextElement>(null);
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
              x1={width}
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
            <motion.g
              style={{
                x: textTranslateX,
                y: CONTENT_HEIGHT / 2 + SQUARE_RADIUS + 25,
              }}
            >
              <TranslateText ref={textRef}>translateX(0px)</TranslateText>
            </motion.g>
          </svg>
        </ContentWrapper>
        <Controls css={{ alignItems: "center" }}>
          <ToggleButton onClick={() => animate(x, -distance, { duration: 3 })}>
            Invert
          </ToggleButton>
          <UndoButton onClick={() => x.set(0)} />
        </Controls>
      </Visualizer>
    </FullWidth>
  );
};

const TranslateText = styled(motion.text, {
  fontFamily: "$mono",
  fontSize: "$sm",

  [`.${darkTheme} &`]: {
    fill: "$gray12",
  },
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
