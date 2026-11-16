import React from "react";
import { motion, transform } from "framer-motion";
import { useStateContext } from "./state-context";

const BUTTON_GRID_SIZE = 32;
const GRID_PADDING = 4;
const MIDPOINT = BUTTON_GRID_SIZE / 2;

const getOffset = transform([-100, 100], [-MIDPOINT, MIDPOINT]);

export const InteractiveCommand = ({ id, template }) => {
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  const {
    data: { x, y },
    set,
  } = useStateContext<Record<string, { x: number; y: number }>>()(id);
  return (
    <div className="flex justify-between bg-gray3 border border-gray8 rounded-md p-1 items-center">
      <p className="ml-2">
        <code>{template({ x, y })}</code>
      </p>
      <motion.button
        className="block"
        onPan={(_, info) => {
          const deltaX = transform(info.delta.x, [-100, 100], [-10, 10]);
          const deltaY = transform(info.delta.y, [-100, 100], [-10, 10]);
          set({ x: x + deltaX, y: y + deltaY });
          setOffset({
            x: getOffset(info.offset.x),
            y: getOffset(info.offset.y),
          });
        }}
        onPanEnd={() => setOffset({ x: 0, y: 0 })}
      >
        <svg
          viewBox={`-${GRID_PADDING} -${GRID_PADDING} ${
            BUTTON_GRID_SIZE + GRID_PADDING * 2
          } ${BUTTON_GRID_SIZE + GRID_PADDING * 2}`}
          width="32"
          className="aspect-square"
        >
          <rect
            width={BUTTON_GRID_SIZE}
            height={BUTTON_GRID_SIZE}
            className="fill-gray2 stroke-gray8"
            rx="4"
          />
          <g className="stroke-gray8">
            <line x1={MIDPOINT} y1="0" x2={MIDPOINT} y2={BUTTON_GRID_SIZE} />
            <line y1={MIDPOINT} x1="0" y2={MIDPOINT} x2={BUTTON_GRID_SIZE} />
          </g>
          <motion.circle
            animate={{
              x: MIDPOINT + offset.x,
              y: MIDPOINT + offset.y,
            }}
            initial={{
              x: MIDPOINT,
              y: MIDPOINT,
            }}
            r="4"
            className="fill-gray12"
          />
        </svg>
      </motion.button>
    </div>
  );
};
