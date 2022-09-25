import React from "react";
import { useMachine } from "@xstate/react";
import { assign } from "xstate";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";
import { BsPlayFill, BsPauseFill } from "react-icons/bs";

import { GridBackground } from "~/components/Grid";
import { FullWidth } from "~/components/FullWidth";
import { styled } from "~/stitches.config";

import { ContentWrapper, ToggleButton } from "../shared";
import { machine, STATE_ORDER } from "./machine";

const PADDING = 45;
const SQUARE_RADIUS = 60;

export const FlipOverview = () => {
  const x = useMotionValue(0);
  const squareTranslateX = useTransform(x, (val) => -(SQUARE_RADIUS * 2) + val);
  const textTranslateX = useTransform(squareTranslateX, (val) => val - PADDING);

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
        `${(SQUARE_RADIUS + PADDING) * 2 + val + distance}px`
      );
      textRef.current.textContent = `translateX(${val.toFixed(0)}px)`;
    });
  }, [x, state]);

  const showTransformVisuals = ["inverse", "play"].some(state.matches);
  const toggled = stateAfter("last");

  return (
    <FullWidth>
      <div>
        <Header>
          <StateButton onClick={() => setPlaying(!playing)}>
            {playing ? <BsPauseFill /> : <BsPlayFill />}
          </StateButton>
          <FlipStateList>
            <FlipState active={state.matches("first")}>First</FlipState>
            <FlipState active={state.matches("last")}>Last</FlipState>
            <FlipState active={state.matches("inverse")}>Inverse</FlipState>
            <FlipState active={state.matches("play")}>Play</FlipState>
          </FlipStateList>
          <StateButton
            onClick={() => send("prev")}
            disabled={!state.can("prev")}
          >
            <HiArrowLeft />
          </StateButton>
          <StateButton
            onClick={() => send("next")}
            disabled={!state.can("next")}
          >
            <HiArrowRight />
          </StateButton>
        </Header>
        <GridBackground>
          <Content>
            <svg width="100%" height="100%">
              <Square ref={initialRef} x={PADDING} />
              <Square
                ref={finalRef}
                x={`calc(100% - ${SQUARE_RADIUS * 2 + PADDING}px)`}
              />
              <TranslateText
                x={PADDING}
                y="50%"
                style={{ translateY: -(SQUARE_RADIUS + 15) }}
                visible={stateAfter("first")}
              >
                x: {state.context.firstBox?.x.toFixed(1)}
              </TranslateText>
              <TranslateText
                x="100%"
                y="50%"
                style={{
                  translateY: -(SQUARE_RADIUS + 15),
                  translateX: -(SQUARE_RADIUS * 2 + PADDING),
                }}
                visible={stateAfter("last")}
              >
                x: {state.context.lastBox?.x.toFixed(1)}
              </TranslateText>
              <AnchorLine
                ref={lineRef}
                x2="100%"
                y1="50%"
                y2="50%"
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
              <Element
                x={toggled ? `calc(100% - ${PADDING}px)` : PADDING}
                style={{ translateX: toggled ? squareTranslateX : 0 }}
              />
              <TranslateText
                ref={textRef}
                x="100%"
                y="50%"
                visible={showTransformVisuals}
                style={{
                  translateY: SQUARE_RADIUS + 25,
                  translateX: textTranslateX,
                }}
              />
            </svg>
          </Content>
        </GridBackground>
      </div>
    </FullWidth>
  );
};

const StateButton = styled(ToggleButton, {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "$gray10",
});

const Header = styled("header", {
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  zIndex: 10,
  background: "$gray3",
  boxShadow: "$sm",
  padding: "$2",
  borderRadius: "$base",
  border: "1px solid hsla(0, 0%, 0%, 0.2)",
  width: "fit-content",
  margin: "0 auto",
  marginBottom: "-$2",
  gap: "$1",
});

const FlipStateList = styled("ol", {
  listStyle: "none",
  display: "flex",
  gap: "$2",
  margin: "0 $10",
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

const Content = styled(ContentWrapper, {
  height: 300,
  paddingLeft: `0 !important`,
  paddingRight: `0 !important`,
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
  fill: "$blue5",
  stroke: "$blue7",
});
