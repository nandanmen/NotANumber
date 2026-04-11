"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import * as React from "react";

import {
  Content,
  Controls,
  ToggleButton,
  UndoButton,
  Visualizer,
} from "~/components/Visualizer";
import { Wide } from "~/components/mdx/Wide";
import { cn } from "~/lib/cn";

import { PADDING, SQUARE_RADIUS, SvgSquare } from "../shared/styles";

const CONTENT_HEIGHT = 300;
const squareY = CONTENT_HEIGHT / 2 - SQUARE_RADIUS;

export const FlipInverse = () => {
  const x = useMotionValue(0);
  const squareTranslateX = useTransform(x, (val) => -(SQUARE_RADIUS * 2) + val);

  const [width, setWidth] = React.useState(0);
  const widthRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setWidth(widthRef.current?.offsetWidth ?? 0);
  }, []);

  const distance = width - PADDING - SQUARE_RADIUS * 2 - PADDING;
  const textTranslateX = useTransform(x, (val) => val + PADDING + distance);

  const lineRef = React.useRef<SVGLineElement>(null);
  const textRef = React.useRef<SVGTextElement>(null);
  React.useEffect(() => {
    return x.onChange((val) => {
      lineRef.current?.setAttribute(
        "x1",
        `${(SQUARE_RADIUS + PADDING) * 2 + val + distance}`,
      );
      if (textRef.current) {
        textRef.current.textContent = `translateX(${val.toFixed(0)}px)`;
      }
    });
  }, [x, distance]);

  const finalBoxX = width - SQUARE_RADIUS * 2 - PADDING;
  const textY = CONTENT_HEIGHT / 2 - SQUARE_RADIUS - 15;

  return (
    <Wide>
      <Visualizer>
        <Content noOverflow ref={widthRef} style={{ height: CONTENT_HEIGHT }}>
          <svg
            width="100%"
            height="100%"
            role="img"
            aria-label="FLIP inverse layout animation"
          >
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
            {width ? (
              <motion.g
                style={{
                  x: width - SQUARE_RADIUS - PADDING,
                  y: CONTENT_HEIGHT / 2,
                }}
              >
                <AnchorCircle cy="0" cx="0" style={{ rotate: x }} />
              </motion.g>
            ) : null}
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
        </Content>
        <Controls className="items-center">
          <ToggleButton onClick={() => animate(x, -distance, { duration: 3 })}>
            Invert
          </ToggleButton>
          <UndoButton onClick={() => x.set(0)} />
        </Controls>
      </Visualizer>
    </Wide>
  );
};

function TranslateText({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof motion.text>) {
  return (
    <motion.text
      className={cn("fill-gray12 font-mono text-sm", className)}
      {...props}
    />
  );
}

function AnchorCircle(
  props: React.ComponentPropsWithoutRef<typeof motion.circle>,
) {
  return (
    <motion.circle
      r={10}
      className="fill-gray5 stroke-gray8 stroke-2 [stroke-dasharray:12_2]"
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
