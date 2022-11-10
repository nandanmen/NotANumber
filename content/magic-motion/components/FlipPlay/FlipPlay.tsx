import React from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { FaPlay, FaUndo } from "react-icons/fa";

import { FullWidth } from "~/components/FullWidth";
import {
  Visualizer,
  Content,
  Controls,
  PlayButton,
  UndoButton,
} from "~/components/Visualizer";
import { styled } from "~/stitches.config";

const PADDING = 32;
const SQUARE_RADIUS = 60;

export const FlipPlay = () => {
  const x = useMotionValue(0);
  const squareTranslateX = useTransform(x, (val) => -(SQUARE_RADIUS * 2) + val);
  const textTranslateX = useTransform(squareTranslateX, (val) => val - PADDING);

  /**
   * Measure the initial and last positions
   */
  const initialRef = React.useRef<SVGRectElement>();
  const finalRef = React.useRef<SVGRectElement>();

  const [initialBox, setInitialBox] = React.useState(null);
  const [finalBox, setFinalBox] = React.useState(null);

  React.useEffect(() => {
    setInitialBox(initialRef.current.getBoundingClientRect());
    setFinalBox(finalRef.current.getBoundingClientRect());
  }, []);

  /**
   * Move the element to the initial position
   */
  const distance = (finalBox?.x ?? 0) - (initialBox?.x ?? 0);
  React.useEffect(() => x.set(-1 * distance), [distance, x]);

  /**
   * Updating the line and text with the motion value
   */
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
        <ContentWrapper noOverflow>
          <svg width="100%" height="100%">
            <Square ref={initialRef} x={PADDING} />
            <Square
              ref={finalRef}
              x={`calc(100% - ${SQUARE_RADIUS * 2 + PADDING}px)`}
            />
            <AnchorLine
              ref={lineRef}
              x1={(SQUARE_RADIUS + PADDING) * 2}
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
              x={`calc(100% - ${PADDING}px)`}
              style={{ translateX: squareTranslateX }}
            />
            <TranslateText
              ref={textRef}
              style={{
                translateY: SQUARE_RADIUS + 25,
                translateX: textTranslateX,
              }}
              x="100%"
              y="50%"
            >
              translateX(-{distance.toFixed(0)}px)
            </TranslateText>
          </svg>
        </ContentWrapper>
        <Controls>
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
  height: 300,
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

const Square = styled(motion.rect, {
  width: 120,
  height: 120,
  fill: "$gray5",
  stroke: "$gray8",
  rx: "6px",
  y: `calc(50% - ${SQUARE_RADIUS}px)`,
  filter: "drop-shadow(var(--shadows-sm))",
});

const Element = styled(Square, {
  fill: "$blue6",
  stroke: "$blue8",
});
