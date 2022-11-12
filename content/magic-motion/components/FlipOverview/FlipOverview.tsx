import React from "react";
import { useMachine } from "@xstate/react";
import { assign } from "xstate";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { FaArrowLeft, FaArrowRight, FaPause, FaPlay } from "react-icons/fa";

import {
  Visualizer,
  Content,
  Controls,
  IconButton,
} from "~/components/Visualizer";
import { FullWidth } from "~/components/FullWidth";
import { styled } from "~/stitches.config";

import { machine, STATE_ORDER } from "./machine";
import { SvgSquare, PADDING, SQUARE_RADIUS } from "../shared/styles";

const CONTENT_HEIGHT = 300;

export const FlipOverview = () => {
  const x = useMotionValue(0);
  const squareTranslateX = useTransform(x, (val) => -(SQUARE_RADIUS * 2) + val);
  const textTranslateX = useTransform(squareTranslateX, (val) => val - PADDING);

  // --

  const [width, setWidth] = React.useState(0);
  const widthRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setWidth(widthRef.current?.offsetWidth);
  }, []);

  // --

  // Playing states
  const [playing, setPlaying] = React.useState(false);

  const initialRef = React.useRef<SVGRectElement>();
  const finalRef = React.useRef<SVGRectElement>();

  const [state, send] = useMachine(machine, {
    actions: {
      measureFirst: assign({
        firstBox: () => initialRef.current.getBoundingClientRect(),
      }),
      measureLast: assign({
        lastBox: () => finalRef.current.getBoundingClientRect(),
      }),
      invert: () => {
        const startX = state.context.firstBox?.x ?? 0;
        const endX = state.context.lastBox?.x ?? 0;
        const distance = endX - startX;
        x.set(-1 * distance);
      },
      removeTransform: () => {
        x.set(0);
      },
      play: () => {
        animate(x, 0, { duration: 3, onComplete: () => setPlaying(false) });
      },
    },
  });

  React.useEffect(() => {
    if (playing) {
      const timeout = setInterval(() => {
        if (!state.matches("play")) {
          send("next");
        } else {
          clearInterval(timeout);
        }
      }, 1200);
      return () => clearInterval(timeout);
    }
  }, [playing, send, state]);

  const stateAfter = (compareState: string) => {
    return (
      STATE_ORDER.indexOf(state.value as string) >=
      STATE_ORDER.indexOf(compareState)
    );
  };

  /**
   * Updating the line and text with the motion value
   */
  const lineRef = React.useRef<SVGLineElement>();
  const textRef = React.useRef<SVGTextElement>();

  React.useEffect(() => {
    return x.onChange((val) => {
      const distance =
        (state.context.lastBox?.x ?? 0) - (state.context.firstBox?.x ?? 0);
      lineRef.current?.setAttribute(
        "x1",
        `${(SQUARE_RADIUS + PADDING) * 2 + val + distance}`
      );
      textRef.current.textContent = `translateX(${val.toFixed(0)}px)`;
    });
  }, [x, state]);

  const showTransformVisuals = ["inverse", "play"].some(state.matches);
  const toggled = stateAfter("last");

  const finalX = width - SQUARE_RADIUS * 2 - PADDING;
  const midY = CONTENT_HEIGHT / 2;

  return (
    <FullWidth>
      <Visualizer>
        <ContentWrapper noOverflow ref={widthRef}>
          <svg width="100%" height="100%">
            <Square ref={initialRef} x={PADDING} type="secondary" />
            <Square ref={finalRef} x={finalX} type="secondary" />
            <TranslateText
              x={PADDING}
              y={midY}
              style={{ translateY: -(SQUARE_RADIUS + 15) }}
              visible={stateAfter("first")}
            >
              x: {state.context.firstBox?.x.toFixed(1)}
            </TranslateText>
            <TranslateText
              x={finalX}
              y={midY}
              style={{
                translateY: -(SQUARE_RADIUS + 15),
              }}
              visible={stateAfter("last")}
            >
              x: {state.context.lastBox?.x.toFixed(1)}
            </TranslateText>
            <AnchorLine
              ref={lineRef}
              x2={width}
              y1={midY}
              y2={midY}
              style={{
                transform: `translateX(-${SQUARE_RADIUS + PADDING}px)`,
                display: showTransformVisuals ? "block" : "none",
              }}
            />
            <AnchorCircle
              style={{
                rotate: x,
                translateX: -(SQUARE_RADIUS + PADDING),
              }}
              hidden={!showTransformVisuals}
            />
            <Square
              x={toggled ? `calc(100% - ${PADDING}px)` : PADDING}
              style={{ translateX: toggled ? squareTranslateX : 0 }}
            />
            <TranslateText
              ref={textRef}
              x={width}
              y={midY}
              visible={showTransformVisuals}
              style={{
                translateY: SQUARE_RADIUS + 25,
                translateX: textTranslateX,
              }}
            />
          </svg>
        </ContentWrapper>
        <Controls css={{ alignItems: "center" }}>
          <IconButton onClick={() => setPlaying(!playing)} secondary>
            {playing ? <FaPause /> : <FaPlay />}
          </IconButton>
          <FlipStateList>
            <FlipState active={state.matches("first")}>First</FlipState>
            <FlipState active={state.matches("last")}>Last</FlipState>
            <FlipState active={state.matches("inverse")}>Inverse</FlipState>
            <FlipState active={state.matches("play")}>Play</FlipState>
          </FlipStateList>
          <StepControls>
            <IconButton
              onClick={() => send("prev")}
              disabled={!state.can("prev")}
              secondary
            >
              <FaArrowLeft />
            </IconButton>
            <IconButton
              onClick={() => send("next")}
              disabled={!state.can("next")}
              secondary
            >
              <FaArrowRight />
            </IconButton>
          </StepControls>
        </Controls>
      </Visualizer>
    </FullWidth>
  );
};

const StepControls = styled("div", {
  display: "flex",
});

const FlipStateList = styled("ol", {
  listStyle: "none",
  display: "flex",
  gap: "$2",
});

const FlipState = styled("li", {
  opacity: 0.2,
  transition: "opacity 0.3s ease-out",

  variants: {
    active: {
      true: {
        opacity: 1,
      },
    },
  },
});

const TranslateText = styled(motion.text, {
  fontFamily: "$mono",
  fontSize: "$sm",
  opacity: 0,
  transition: "opacity 0.3s ease-out",

  variants: {
    visible: {
      true: {
        opacity: 1,
      },
    },
  },
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
  variants: {
    hidden: {
      true: {
        opacity: 0,
      },
    },
  },
});

const AnchorLine = styled("line", {
  stroke: "$gray8",
  strokeWidth: 2,
});

const Square = styled(SvgSquare, {
  width: 120,
  y: CONTENT_HEIGHT / 2 - SQUARE_RADIUS,
});
