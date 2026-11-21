import React from "react";
import { motion } from "framer-motion";
import { useSvgContext } from "./svg";

export function Ripple({
  cx,
  cy,
  delay = 0,
  color = "fill-gray12",
  children,
}: {
  cx: number;
  cy: number;
  delay?: number;
  color?: string;
  children: React.ReactNode;
}) {
  const id = React.useId();
  const { config, getRelative } = useSvgContext();
  const padding = getRelative(config.padding);
  const endpointSize = getRelative(1);
  return (
    <g>
      <mask id={id}>
        <rect
          x={-padding}
          y={-padding}
          width="100%"
          height="100%"
          fill="white"
        />
        <motion.circle
          cx={cx}
          cy={cy}
          r={endpointSize * 1.25}
          animate={{ r: endpointSize * 7 }}
          transition={{ type: "spring", damping: 20, delay }}
          initial={{ r: endpointSize * 1.25 }}
          fill="black"
        />
      </mask>
      <motion.circle
        className={color}
        cx={cx}
        cy={cy}
        r={endpointSize * 6}
        mask={`url('#${id}')`}
        animate="shown"
        initial="hidden"
        variants={{
          hidden: { scale: 0.5, opacity: 0 },
          shown: { scale: 1, opacity: 1 },
        }}
        transition={{ type: "spring", damping: 10, stiffness: 150, delay }}
      />
      <motion.g
        animate="shown"
        initial="hidden"
        variants={{
          hidden: { scale: 0.5, opacity: 0 },
          shown: { scale: 1, opacity: 1 },
        }}
        transition={{ type: "spring", damping: 10, stiffness: 150, delay }}
      >
        {children}
      </motion.g>
    </g>
  );
}
