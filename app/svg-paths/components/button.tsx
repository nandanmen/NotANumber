import { motion } from "framer-motion";

export function Button(
  props: React.ComponentPropsWithoutRef<(typeof motion)["button"]>
) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className="bg-gray1 border-gray8 rounded-md border shadow-sm text-sm px-2 py-1"
      {...props}
    />
  );
}
