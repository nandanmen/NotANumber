"use client";

import { useMachine } from "@xstate/react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import * as React from "react";
import { FaArrowLeft, FaArrowRight, FaPause, FaPlay } from "react-icons/fa";
import { assign } from "xstate";

import {
  Content,
  Controls,
  IconButton,
  Visualizer,
} from "~/components/Visualizer";
import { Wide } from "~/components/mdx/Wide";
import { cn } from "~/lib/cn";

import { PADDING, SQUARE_RADIUS, SvgSquare } from "../shared/styles";
import { STATE_ORDER, machine } from "./machine";

const CONTENT_HEIGHT = 300;
const squareY = CONTENT_HEIGHT / 2 - SQUARE_RADIUS;

export const FlipOverview = () => {
  const x = useMotionValue(0);
  const squareTranslateX = useTransform(x, (val) => -(SQUARE_RADIUS * 2) + val);

  const [width, setWidth] = React.useState(0);
  const widthRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setWidth(widthRef.current?.offsetWidth ?? 0);
  }, []);

  const [playing, setPlaying] = React.useState(false);

  const initialRef = React.useRef<SVGRectElement>(null);
  const finalRef = React.useRef<SVGRectElement>(null);

  const [state, send] = useMachine(machine, {
    actions: {
      measureFirst: assign({
        firstBox: () =>
          initialRef.current?.getBoundingClientRect() ?? new DOMRect(),
      }),
      measureLast: assign({
        lastBox: () =>
          finalRef.current?.getBoundingClientRect() ?? new DOMRect(),
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

  const distance = width - PADDING - SQUARE_RADIUS * 2 - PADDING;
  const textTranslateX = useTransform(x, (val) => val + PADDING + distance);

  const lineRef = React.useRef<SVGLineElement>(null);
  const textRef = React.useRef<SVGTextElement>(null);

  React.useEffect(() => {
    return x.onChange((val) => {
      const dist =
        (state.context.lastBox?.x ?? 0) - (state.context.firstBox?.x ?? 0);
      lineRef.current?.setAttribute(
        "x1",
        `${(SQUARE_RADIUS + PADDING) * 2 + val + dist}`,
      );
      if (textRef.current) {
        textRef.current.textContent = `translateX(${val.toFixed(0)}px)`;
      }
    });
  }, [x, state]);

  const showTransformVisuals = ["inverse", "play"].some(state.matches);
  const toggled = stateAfter("last");

  const finalX = width - SQUARE_RADIUS * 2 - PADDING;
  const midY = CONTENT_HEIGHT / 2;

  return (
    <Wide>
      <Visualizer>
        <Content noOverflow ref={widthRef} style={{ height: CONTENT_HEIGHT }}>
          <svg
            width="100%"
            height="100%"
            role="img"
            aria-label="FLIP steps overview"
          >
            <Square ref={initialRef} x={PADDING} type="secondary" />
            <Square ref={finalRef} x={finalX} type="secondary" />
            <TranslateText
              x={PADDING}
              y={midY - SQUARE_RADIUS - 15}
              visible={stateAfter("first")}
            >
              x: {state.context.firstBox?.x.toFixed(1)}
            </TranslateText>
            <TranslateText
              x={finalX}
              y={midY - SQUARE_RADIUS - 15}
              visible={stateAfter("last")}
            >
              x: {state.context.lastBox?.x.toFixed(1)}
            </TranslateText>
            <AnchorLine
              ref={lineRef}
              x1={PADDING + SQUARE_RADIUS * 2}
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
            <motion.g
              style={{
                x: textTranslateX,
                y: midY + SQUARE_RADIUS + 25,
              }}
            >
              <TranslateText ref={textRef} visible={showTransformVisuals} />
            </motion.g>
          </svg>
        </Content>
        <Controls className="items-center">
          <IconButton
            onClick={() => setPlaying(!playing)}
            secondary
            label={playing ? "Pause" : "Play"}
          >
            {playing ? <FaPause /> : <FaPlay />}
          </IconButton>
          <FlipStateList>
            <FlipState active={state.matches("first")}>First</FlipState>
            <FlipState active={state.matches("last")}>Last</FlipState>
            <FlipState active={state.matches("inverse")}>Inverse</FlipState>
            <FlipState active={state.matches("play")}>Play</FlipState>
          </FlipStateList>
          <div className="flex gap-1">
            <IconButton
              onClick={() => send("prev")}
              disabled={!state.can("prev")}
              secondary
              label="Previous step"
            >
              <FaArrowLeft />
            </IconButton>
            <IconButton
              onClick={() => send("next")}
              disabled={!state.can("next")}
              secondary
              label="Next step"
            >
              <FaArrowRight />
            </IconButton>
          </div>
        </Controls>
      </Visualizer>
    </Wide>
  );
};

function FlipStateList({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"ol">) {
  return <ol className={cn("flex list-none gap-2", className)} {...props} />;
}

function FlipState({
  active,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { active?: boolean }) {
  return (
    <li
      className={cn(active ? "opacity-100" : "opacity-20", className)}
      {...props}
    />
  );
}

function TranslateText({
  visible = true,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof motion.text> & {
  visible?: boolean;
}) {
  return (
    <motion.text
      className={cn(
        "fill-gray12 font-mono text-sm",
        visible ? "opacity-100" : "opacity-0",
        className,
      )}
      {...props}
    />
  );
}

function AnchorCircle({
  hidden,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof motion.circle> & {
  hidden?: boolean;
}) {
  return (
    <motion.circle
      cx="100%"
      cy="50%"
      r={10}
      className={cn(
        "fill-gray5 stroke-gray8 stroke-2 [stroke-dasharray:12_2]",
        hidden ? "opacity-0" : "opacity-100",
        className,
      )}
      {...props}
    />
  );
}

const AnchorLine = React.forwardRef<
  SVGLineElement,
  React.ComponentPropsWithoutRef<"line">
>(function AnchorLine({ className, ...props }, ref) {
  return (
    <line
      ref={ref}
      className={cn("stroke-gray8 stroke-2", className)}
      {...props}
    />
  );
});

function Square({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof SvgSquare>) {
  return (
    <SvgSquare y={squareY} className={cn("w-[120px]", className)} {...props} />
  );
}
