import React from "react";
import { motion } from "framer-motion";
import { useSvgContext } from "../svg";

export function Path(
  props: React.ComponentPropsWithoutRef<(typeof motion)["path"]>
) {
  const { useRelativeMotionValue } = useSvgContext();
  return (
    <motion.path
      className="fill-none stroke-current"
      strokeWidth={useRelativeMotionValue(1.25)}
      {...props}
    />
  );
}
