import { type HTMLMotionProps, motion } from "framer-motion";
import { cn } from "~/lib/cn";

type PrimaryButtonProps = HTMLMotionProps<"button"> & { small?: boolean };

export const PrimaryButton = ({
  small,
  className,
  ...props
}: PrimaryButtonProps) => {
  return (
    <div className="group relative w-fit">
      <span className="absolute inset-0 -z-1 rounded-md bg-gray12 transition-all duration-200 ease-out group-hover:translate-x-[2px] group-hover:translate-y-[2px]" />
      <motion.button
        whileTap={{ x: 2, y: 2 }}
        className={cn(
          "relative cursor-pointer rounded-md border border-gray12 bg-gray12 px-4 py-2 pt-[calc(--spacing(2)+2px)] font-serif font-bold text-gray1 transition-all duration-200 ease-out dark:bg-gray1 dark:text-gray12",
          "group-hover:bg-[linear-gradient(-45deg,var(--gradient-end,var(--color-blue6)),var(--gradient-start,var(--color-blue4)))] group-hover:text-gray12",
          "dark:group-hover:border-gray1 dark:group-hover:bg-[linear-gradient(-45deg,var(--gradient-end,var(--color-blue9)),var(--gradient-start,var(--color-blue6)))] dark:group-hover:text-gray1",
          small && "px-2 py-1 pt-[calc(--spacing(1)+2px)] text-[0.875rem]",
          className,
        )}
        {...props}
      />
    </div>
  );
};
