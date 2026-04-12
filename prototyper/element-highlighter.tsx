"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Rect = { top: number; left: number; width: number; height: number };

type ElementHighlighterProps = {
  selectedElement: HTMLElement;
  activeProp: string | null;
};

export function ElementHighlighter({
  selectedElement,
}: ElementHighlighterProps) {
  const [rect, setRect] = useState<Rect | null>(null);

  useEffect(() => {
    const r = selectedElement.getBoundingClientRect();
    setRect({
      top: r.top,
      left: r.left,
      width: r.width,
      height: r.height,
    });
  }, [selectedElement]);

  if (!rect) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        outline: "2px solid rgb(37 99 235)",
        pointerEvents: "none",
        zIndex: 99997,
      }}
    />,
    document.body,
  );
}
