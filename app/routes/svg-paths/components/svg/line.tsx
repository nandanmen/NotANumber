import React from "react";
import { motion } from "framer-motion";
import { useSvgContext } from "../svg";

type LineVariant = "primary" | "secondary" | "current" | "none";

export function Line({
  variant = "primary",
  dashed = false,
  size = "base",
  ...props
}: {
  variant?: LineVariant;
  dashed?: boolean;
  size?: "base" | "xl";
} & React.ComponentPropsWithoutRef<(typeof motion)["line"]>) {
  const { useRelativeMotionValue } = useSvgContext();
  const dashedValue = useRelativeMotionValue(1);
  const mapVariantToStroke = {
    primary: "stroke-gray10",
    secondary: "stroke-gray8",
    current: "stroke-current",
    none: undefined,
  };
  const mapSizeToWidth = {
    base: 0.5,
    xl: 1.25,
  };
  return (
    <motion.line
      className={mapVariantToStroke[variant]}
      strokeWidth={useRelativeMotionValue(mapSizeToWidth[size])}
      strokeDasharray={dashed && dashedValue}
      {...props}
    />
  );
}
