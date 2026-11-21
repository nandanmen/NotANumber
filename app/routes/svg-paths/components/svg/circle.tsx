import React from "react";
import { motion } from "framer-motion";
import { useSvgContext } from "../svg";

type CircleSize = "base" | "small" | "large";

type CircleVariant = "primary" | "secondary" | "cursor" | "point" | "highlight";

const mapSizeToRadius = {
  small: 0.75,
  base: 1,
  large: 1.25,
};

const mapVariantToFill = {
  primary: "fill-gray10",
  secondary: "fill-gray8",
  cursor: "fill-current",
  point: "fill-gray4",
};

export function Circle({
  variant = "primary",
  size = "base",
  ...props
}: {
  variant?: CircleVariant;
  size?: CircleSize;
} & React.ComponentPropsWithoutRef<(typeof motion)["circle"]>) {
  const { useRelativeMotionValue } = useSvgContext();
  const sizeValue = useRelativeMotionValue(mapSizeToRadius[size]);
  const strokeWidth = useRelativeMotionValue(variant === "point" ? 0.6 : 0);
  return (
    <motion.circle
      className={`${mapVariantToFill[variant]} stroke-current`}
      r={sizeValue}
      strokeWidth={strokeWidth}
      {...props}
    />
  );
}
