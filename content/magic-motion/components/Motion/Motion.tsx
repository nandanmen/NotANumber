import React, { ComponentPropsWithoutRef } from "react";
import { animate } from "popmotion";

import { styled } from "~/stitches.config";

type MotionProps = {
  size?: number;
  corrected?: boolean;
  parentElement?: HTMLElement;
  children?: React.ReactNode;
  scaleCorrection?: "naive" | "final";
} & ComponentPropsWithoutRef<typeof Square>;

export function Motion({
  size = 120,
  corrected = true,
  scaleCorrection,
  children,
  ...props
}: MotionProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const childRef = React.useRef<HTMLSpanElement>(null);

  const lastRect = React.useRef<DOMRect>(null);
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
        corrected
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

    lastRect.current = box;
    lastRectY.current = box.y;
    scrollTop.current = document.documentElement.scrollTop;
  });

  return (
    <Square ref={ref} css={{ width: size, height: size }} {...props}>
      <span ref={childRef}>{children}</span>
    </Square>
  );
}

const Square = styled("div", {
  background: "$blue6",
  border: "1px solid $blue8",
  borderRadius: "$base",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

function isBoxDifferent(box: DOMRect, lastBox: DOMRect) {
  // first mount
  if (!lastBox) {
    return false;
  }
  return JSON.stringify(box) !== JSON.stringify(lastBox);
}

function invert({ el, from, to }, corrected) {
  const { x: fromX, y: fromY, width: fromWidth, height: fromHeight } = from;
  const { x, y, width, height } = to;

  const transform = {
    /**
     * i _think_ its not divided by 2 but by wherever the transform origin is
     */
    x: corrected ? x - fromX - (fromWidth - width) / 2 : x - fromX,
    y: corrected ? y - fromY - (fromHeight - height) / 2 : y - fromY,
    scaleX: width / fromWidth,
    scaleY: height / fromHeight,
  };

  // We multiply by -1 to inverse the translation
  el.style.transform = `translate(${transform.x}px, ${transform.y}px) scaleX(${transform.scaleX}) scaleY(${transform.scaleY})`;

  return transform;
}

function play({ el, transform }) {
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
