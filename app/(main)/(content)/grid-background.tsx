"use client";

import { useEffect, useId, useRef, useState } from "react";

export function GridBackground() {
  const gridId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [patternWidth, setPatternWidth] = useState(20);

  useEffect(() => {
    const updatePatternSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const newPatternWidth = containerWidth / 15;
        setPatternWidth(newPatternWidth);
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
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute !col-start-4 col-span-2 row-start-1 border-l border-borderSoft top-0 bottom-0 !max-w-full"
    >
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none text-borderSoft"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <title>Grid background pattern</title>
        <defs>
          <pattern
            id={gridId}
            width={patternWidth}
            height={patternWidth}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${patternWidth} 0 L 0 0 0 ${patternWidth}`}
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
