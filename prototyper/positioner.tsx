import { type ReactNode, useEffect, useState } from "react";

type PositionerProps = {
  referenceElement: HTMLElement;
  className?: string;
  children: ReactNode;
};

type Side = "right" | "left";

const MAX_WIDTH = 360;

function getSide(el: HTMLElement): Side {
  const rect = el.getBoundingClientRect();
  const spaceRight = window.innerWidth - rect.right;
  if (spaceRight < MAX_WIDTH) {
    const spaceLeft = rect.left;
    if (spaceLeft >= MAX_WIDTH) return "left";
  }
  return "right";
}

export function Positioner({
  referenceElement,
  className,
  children,
}: PositionerProps) {
  const [side, setSide] = useState<Side>(() => getSide(referenceElement));

  useEffect(() => {
    setSide(getSide(referenceElement));
  }, [referenceElement]);

  return (
    <div
      data-prototyper
      className={className}
      style={{
        position: "fixed",
        top: 0,
        bottom: 0,
        width: MAX_WIDTH,
        ...(side === "right" ? { right: 0 } : { left: 0 }),
      }}
    >
      {children}
    </div>
  );
}
