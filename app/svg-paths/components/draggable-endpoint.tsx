import React from "react";
import { motion, transform } from "framer-motion";
import { useSvgContext } from "./svg";
import { Endpoint } from "./path-visualizer";

export type EndpointEventHandlers = {
  panStart: () => void;
  pan: (x: number, y: number) => void;
  panEnd: () => void;
  hoverStart: () => void;
  hoverEnd: () => void;
};

export function DraggableEndpoint({
  cx,
  cy,
  on,
}: {
  cx: number;
  cy: number;
  on: Partial<EndpointEventHandlers>;
}) {
  const [panning, setPanning] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const { size, getRelative } = useSvgContext();
  return (
    <motion.g
      className="cursor-pointer"
      onHoverStart={() => {
        if (panning) return;
        setActive(true);
        on.hoverStart?.();
      }}
      onHoverEnd={() => {
        if (panning) return;
        setActive(false);
        on.hoverEnd?.();
      }}
    >
      <motion.circle
        r={getRelative(1)}
        className="fill-blue9"
        cx={cx}
        cy={cy}
        animate={active ? "active" : "idle"}
        variants={{
          active: {
            r: getRelative(2),
          },
          idle: {
            r: getRelative(1),
          },
        }}
      />
      <Endpoint
        cx={cx}
        cy={cy}
        onPanStart={() => {
          on.panStart?.();
          setPanning(true);
          setActive(true);
        }}
        onPan={(_, info) => {
          const { width, x, y } = document
            .querySelector("[data-x-axis-lines]")
            .getBoundingClientRect();
          const relativeX = info.point.x - x;
          const relativeY =
            info.point.y - y - document.documentElement.scrollTop;
          const transformer = transform([0, width], [0, size]);
          const newX = transformer(relativeX);
          const newY = transformer(relativeY);
          on.pan?.(newX, newY);
        }}
        onPanEnd={() => {
          on.panEnd?.();
          setPanning(false);
          setActive(false);
        }}
      />
    </motion.g>
  );
}
