import { motion } from "motion/react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "~/lib/cn";

export function ToggleButton({
  className,
  loading,
  children,
  ...props
}: Omit<ComponentPropsWithoutRef<(typeof motion)["button"]>, "children"> & {
  loading?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="h-8 flex items-center">
      <motion.button
        className={cn(
          "bg-gray3 ring-1 shadow ring-neutral-950/15 flex items-center px-2.5 rounded-lg text-sm font-medium text-gray11 hover:bg-gray4 disabled:opacity-60 disabled:hover:bg-gray3 disabled:cursor-not-allowed",
          loading && "overflow-hidden shadow-none",
          className,
        )}
        whileTap={{ scale: 0.93 }}
        disabled={loading}
        style={{
          backgroundImage: loading
            ? "linear-gradient(to right, #f8f8f8, #e8e8e8 20%, #e8e8e8 30%, #f8f8f8, #e8e8e8 70%, #e8e8e8 80%, #f8f8f8)"
            : undefined,
          backgroundSize: "200%",
        }}
        initial={{ backgroundPosition: "0%", height: 32 }}
        animate={{
          height: loading ? 8 : 32,
          backgroundPosition: "-100%",
        }}
        transition={{
          height: {
            type: "spring",
            bounce: 0,
            duration: 0.3,
          },
          backgroundPosition: {
            type: "tween",
            ease: "linear",
            duration: 0.4,
            repeat: Number.POSITIVE_INFINITY,
          },
        }}
        type="button"
        {...props}
      >
        <span className={cn("transition-opacity", loading && "opacity-0")}>
          {children}
        </span>
      </motion.button>
    </div>
  );
}

type IconButtonProps = {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
  className?: string;
};

export function IconButton({
  onClick,
  label,
  children,
  className,
}: IconButtonProps) {
  return (
    <button
      className={cn(
        "h-8 w-8 rounded-lg bg-gray3 flex items-center justify-center ring-1 shadow ring-neutral-950/15 hover:bg-gray4 text-gray11",
        className,
      )}
      onClick={onClick}
      type="button"
    >
      <span className="sr-only">{label}</span>
      {children}
    </button>
  );
}

export function ResetButton({
  onClick,
  label = "Reset",
}: {
  onClick: () => void;
  label?: string;
}) {
  return (
    <IconButton onClick={onClick} label={label}>
      <svg
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path d="M11.25 4.75L8.75 7L11.25 9.25" />
        <path d="M12.75 19.25L15.25 17L12.75 14.75" />
        <path d="M9.75 7H13.25C16.5637 7 19.25 9.68629 19.25 13V13.25" />
        <path d="M14.25 17H10.75C7.43629 17 4.75 14.3137 4.75 11V10.75" />
      </svg>
    </IconButton>
  );
}
