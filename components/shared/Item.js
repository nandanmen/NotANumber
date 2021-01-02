import clsx from "clsx";
import { motion } from "framer-motion";

const variants = {
  hide: {
    opacity: 0.25,
    scale: 0.9,
  },
  show: {
    opacity: 1,
    scale: 1,
  },
};

export default function Item({ variant = "base", className, active, ...props }) {
  return (
    <motion.div
      variants={variants}
      animate={active ? "show" : "hide"}
      transition={{
        scale: {
          type: "spring",
          bounce: 0.75,
        },
      }}
      className={clsx(
        "w-12 h-12 rounded-lg text-white font-semibold flex items-center justify-center mr-2",
        {
          "bg-green-400": variant === "base",
          "bg-red-500": variant === "danger",
        },
        className
      )}
      {...props}
    />
  );
}
