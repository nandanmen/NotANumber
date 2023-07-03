import clsx from "clsx";
import { motion } from "framer-motion";

export function Button({
  className,
  ...props
}: React.ComponentPropsWithoutRef<(typeof motion)["button"]>) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className={clsx(
        "bg-gray1 border-gray8 rounded-md border shadow-sm text-sm px-2 py-1",
        className
      )}
      {...props}
    />
  );
}
