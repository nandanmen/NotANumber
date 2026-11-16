"use client";

import { type HTMLMotionProps, motion } from "framer-motion";
import { animate } from "popmotion";
import * as React from "react";

import { cn } from "~/lib/cn";

type MotionProps = {
  size?: number;
  corrected?: boolean;
  parentElement?: HTMLElement;
  children?: React.ReactNode;
  scaleCorrection?: "naive" | "final";
} & HTMLMotionProps<"div">;

export function Motion({
  size = 120,
  corrected = true,
  scaleCorrection,
  children,
  className,
  style,
  ...props
}: MotionProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const childRef = React.useRef<HTMLSpanElement>(null);

  const lastRect = React.useRef<DOMRect | null>(null);
  const lastRectY = React.useRef(0);
  const scrollTop = React.useRef(0);

  React.useEffect(() => {
    return document.addEventListener("scroll", () => {
      const newOffset = document.documentElement.scrollTop;
      const deltaScroll = newOffset - scrollTop.current;
      if (lastRect.current) {
        lastRect.current.y = lastRectY.current - deltaScroll;
      }
    });
  }, []);

  React.useLayoutEffect(() => {
    const box = ref.current?.getBoundingClientRect();

    if (isBoxDifferent(box, lastRect.current)) {
      const transform = invert(
        {
          el: ref.current,
          from: box,
          to: lastRect.current,
        },
        corrected,
      );
      play({
        el: ref.current,
        transform,
      });

      if (scaleCorrection === "naive") {
        play({
          el: childRef.current,
          transform: {
            x: 0,
            y: 0,
            scaleX: 1 / transform.scaleX,
            scaleY: 1 / transform.scaleY,
          },
        });
      }
    }

    lastRect.current = box ?? null;
    lastRectY.current = box?.y ?? 0;
    scrollTop.current = document.documentElement.scrollTop;
  });

  return (
    <motion.div
      ref={ref}
      className={cn(
        "relative flex items-center justify-center rounded-md border border-blue8 bg-blue6 shadow-sm",
        className,
      )}
      style={{ width: size, height: size, ...style }}
      {...props}
    >
      <span ref={childRef}>{children}</span>
    </motion.div>
  );
}

function isBoxDifferent(box: DOMRect | undefined, lastBox: DOMRect | null) {
  if (!lastBox || !box) {
    return false;
  }
  return JSON.stringify(box) !== JSON.stringify(lastBox);
}

function invert(
  {
    el,
    from,
    to,
  }: {
    el: HTMLElement | null;
    from: DOMRect | undefined;
    to: DOMRect | null;
  },
  corrected: boolean,
) {
  if (!from || !to || !el) {
    return { x: 0, y: 0, scaleX: 1, scaleY: 1 };
  }
  const { x: fromX, y: fromY, width: fromWidth, height: fromHeight } = from;
  const { x, y, width, height } = to;

  const transform = {
    x: corrected ? x - fromX - (fromWidth - width) / 2 : x - fromX,
    y: corrected ? y - fromY - (fromHeight - height) / 2 : y - fromY,
    scaleX: width / fromWidth,
    scaleY: height / fromHeight,
  };

  el.style.transform = `translate(${transform.x}px, ${transform.y}px) scaleX(${transform.scaleX}) scaleY(${transform.scaleY})`;

  return transform;
}

function play({
  el,
  transform,
}: {
  el: HTMLElement | null;
  transform: {
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
  };
}) {
  if (!el) return;
  animate({
    from: transform,
    to: {
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
    },
    onUpdate: ({ x, y, scaleY, scaleX }) => {
      el.style.transform = `translate(${x}px, ${y}px) scaleX(${scaleX}) scaleY(${scaleY})`;
    },
    duration: 1500,
  });
}
