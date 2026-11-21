import { type HTMLMotionProps, motion } from "framer-motion";
import { cn } from "~/lib/cn";

type RowProps = HTMLMotionProps<"div"> & {
  center?: "all" | "vertical" | "horizontal";
};

export const rowCenter = {
  all: "items-center justify-center",
  vertical: "items-center",
  horizontal: "justify-center",
};

export const Row = ({ center, className, ...props }: RowProps) => (
  <motion.div
    className={cn("flex", center && rowCenter[center], className)}
    {...props}
  />
);
