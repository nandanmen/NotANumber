"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import { useGridSize } from "./grid-context";

export const CONNECTOR_MARKER_ID = "how-computers-talk-connector-marker";

export function GridBackground() {
  const gridId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [patternSize, setPatternSize] = useState(20);
  const { setGridSize } = useGridSize();

  useLayoutEffect(() => {
    const updatePatternSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const newPatternSize = containerWidth / 14;
        setPatternSize(newPatternSize);
        setGridSize(newPatternSize);

        // Set CSS variable on the article parent for children to consume
        const article = containerRef.current.closest("article");
        if (article) {
          article.style.setProperty("--grid-size", `${newPatternSize}px`);
        }
      }
    };

    updatePatternSize();

    const resizeObserver = new ResizeObserver(updatePatternSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [setGridSize]);

  return (
    <div
      ref={containerRef}
      className="absolute !col-start-4 col-span-2 row-start-1 border-l border-borderSoft top-0 bottom-0 !max-w-full -translate-x-px"
    >
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none text-borderSoft"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <marker
            id={CONNECTOR_MARKER_ID}
            markerUnits="userSpaceOnUse"
            markerWidth="10"
            markerHeight="10"
            refX="5"
            refY="5"
            orient="auto"
          >
            <circle cx="5" cy="5" r="4" className="fill-gray8" />
          </marker>
          <pattern
            id={gridId}
            width={patternSize}
            height={patternSize}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${patternSize} 0 L 0 0 0 ${patternSize}`}
              fill="none"
              stroke="currentColor"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${gridId})`} />
      </svg>
    </div>
  );
}
