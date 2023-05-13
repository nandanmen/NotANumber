import { motion } from "framer-motion";
import { useSvgContext } from "./svg";

export function Path(
  props: React.ComponentPropsWithoutRef<(typeof motion)["path"]>
) {
  const { useRelativeMotionValue } = useSvgContext();
  return (
    <motion.path
      strokeWidth={useRelativeMotionValue(1.2)}
      fill="none"
      {...props}
    />
  );
}
