import React from "react";
import { motion, type PanInfo, transform } from "framer-motion";
import { useSvgContext } from "./svg";
import { Endpoint } from "./path-visualizer";

export type EndpointEventHandlers = {
  onPanStart: () => void;
  onPan: (x: number, y: number) => void;
  onPanEnd: () => void;
  onHoverStart: () => void;
  onHoverEnd: () => void;
};

export function useSvgPanHandler() {
  const { size } = useSvgContext();
  return React.useCallback(
    (info: PanInfo, evt: PointerEvent) => {
      const target = evt.target as SVGElement;
      const svg = target.closest("svg");
      const box = svg.querySelector("[data-x-axis-lines]");
      const { width, x, y } = box.getBoundingClientRect();
      const relativeX = info.point.x - x;
      const relativeY = info.point.y - y - document.documentElement.scrollTop;
      const transformer = transform([0, width], [0, size]);
      const deltaTransformer = transform([0, width], [0, size], {
        clamp: false,
      });
      return {
        x: transformer(relativeX),
        y: transformer(relativeY),
        dx: deltaTransformer(info.delta.x),
        dy: deltaTransformer(info.delta.y),
      };
    },
    [size]
  );
}

export function DraggableEndpoint({
  cx,
  cy,
  onPan,
  onPanStart,
  onPanEnd,
  onHoverStart,
  onHoverEnd,
}: {
  cx: number;
  cy: number;
} & Partial<EndpointEventHandlers>) {
  const [panning, setPanning] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const handlePan = useSvgPanHandler();
  const { getRelative } = useSvgContext();
  return (
    <motion.g
      className="cursor-pointer"
      onHoverStart={() => {
        if (panning) return;
        setActive(true);
        onHoverStart?.();
      }}
      onHoverEnd={() => {
        if (panning) return;
        setActive(false);
        onHoverEnd?.();
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
          onPanStart?.();
          setPanning(true);
          setActive(true);
        }}
        onPan={(evt, info) => {
          const { x, y } = handlePan(info, evt);
          onPan?.(x, y);
        }}
        onPanEnd={() => {
          onPanEnd?.();
          setPanning(false);
          setActive(false);
        }}
      />
    </motion.g>
  );
}
