import React, { ComponentPropsWithoutRef } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";

import { FullWidth } from "~/components/FullWidth";
import {
  Visualizer,
  Content,
  Controls,
  UndoButton,
  ToggleButton,
} from "~/components/Visualizer";
import { styled } from "~/stitches.config";

const PADDING = 32;
const SQUARE_RADIUS = 60;
const CONTENT_HEIGHT = 300;

export const FlipInverse = () => {
  const x = useMotionValue(0);
  const squareTranslateX = useTransform(x, (val) => -(SQUARE_RADIUS * 2) + val);
  const textTranslateX = useTransform(squareTranslateX, (val) => val - PADDING);

  // -- width

  const [width, setWidth] = React.useState(0);
  const widthRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setWidth(widthRef.current?.offsetWidth);
  }, []);

  // -- measure initial and final positions --

  const initialRef = React.useRef<SVGRectElement>();
  const finalRef = React.useRef<SVGRectElement>();

  const [initialBox, setInitialBox] = React.useState(null);
  const [finalBox, setFinalBox] = React.useState(null);

  React.useEffect(() => {
    setInitialBox(initialRef.current.getBoundingClientRect());
    setFinalBox(finalRef.current.getBoundingClientRect());
  }, []);

  // --

  const distance = (finalBox?.x ?? 0) - (initialBox?.x ?? 0);

  const lineRef = React.useRef<SVGLineElement>();
  const textRef = React.useRef<SVGTextElement>();
  React.useEffect(() => {
    return x.onChange((val) => {
      lineRef.current?.setAttribute(
        "x1",
        `${(SQUARE_RADIUS + PADDING) * 2 + val + distance}px`
      );
      textRef.current.textContent = `translateX(${val.toFixed(0)}px)`;
    });
  }, [x, distance]);

  return (
    <FullWidth>
      <Visualizer>
        <ContentWrapper noOverflow ref={widthRef}>
          <svg width="100%" height="100%">
            <Square ref={initialRef} x={PADDING} />
            <TranslateText
              style={{
                translateY: -SQUARE_RADIUS - 15,
              }}
              x={PADDING}
              y="50%"
            >
              x: {initialBox?.x.toFixed(0)}
            </TranslateText>
            <Square ref={finalRef} x={width - SQUARE_RADIUS * 2 - PADDING} />
            <AnchorLine
              ref={lineRef}
              x1="100%"
              x2="100%"
              y1="50%"
              y2="50%"
              style={{
                transform: `translateX(-${SQUARE_RADIUS + PADDING}px)`,
              }}
            />
            <AnchorCircle
              style={{ rotate: x, translateX: -(SQUARE_RADIUS + PADDING) }}
            />
            <Element
              x={width - PADDING}
              style={{ translateX: squareTranslateX }}
            />
            <TranslateText
              style={{
                translateY: -SQUARE_RADIUS - 15,
                translateX: -(SQUARE_RADIUS * 2 + PADDING),
              }}
              x="100%"
              y="50%"
            >
              x: {finalBox?.x.toFixed(0)}
            </TranslateText>
            <TranslateText
              ref={textRef}
              style={{
                translateY: SQUARE_RADIUS + 25,
                translateX: textTranslateX,
              }}
              x="100%"
              y="50%"
            >
              translateX(0px)
            </TranslateText>
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

const Square = React.forwardRef<
  SVGRectElement,
  ComponentPropsWithoutRef<typeof _Square>
>(function Square(props, ref) {
  return <_Square ref={ref} rx="6" {...props} />;
});

const TranslateText = styled(motion.text, {
  fontFamily: "$mono",
  fontSize: "$sm",
});

const ContentWrapper = styled(Content, {
  height: CONTENT_HEIGHT,
});

const AnchorCircle = styled(motion.circle, {
  cx: "100%",
  cy: "50%",
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

const _Square = styled(motion.rect, {
  width: 120,
  height: 120,
  fill: "$gray5",
  stroke: "$gray8",
  y: `${CONTENT_HEIGHT / 2 - SQUARE_RADIUS}px`,
  filter: "drop-shadow(var(--shadows-sm))",
});

const Element = styled(Square, {
  fill: "$blue6",
  stroke: "$blue8",
});
