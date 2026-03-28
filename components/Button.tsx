"use client";

import { motion } from "motion/react";
import {
  type ComponentPropsWithoutRef,
  forwardRef,
  type ReactNode,
} from "react";
import { cn } from "~/lib/cn";

type MotionButtonProps = ComponentPropsWithoutRef<(typeof motion)["button"]>;

export type ButtonProps = Omit<MotionButtonProps, "children"> & {
  loading?: boolean;
  children: ReactNode;
  variant?: "default" | "secondary";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      className,
      loading = false,
      variant = "default",
      children,
      disabled,
      whileTap,
      ...props
    },
    ref,
  ) {
    const isSecondary = variant === "secondary";

    if (isSecondary) {
      return (
        <motion.button
          ref={ref}
          type="button"
          disabled={disabled || loading}
          whileTap={whileTap ?? { scale: 0.93 }}
          className={cn(
            "cursor-pointer rounded border border-gray8 bg-gray1 px-2 py-1 text-sm",
            "hover:border-gray12",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gray8",
            "disabled:border-gray7 disabled:bg-gray5 disabled:text-gray11 disabled:cursor-not-allowed",
            "border-0 bg-transparent hover:bg-gray7 disabled:pointer-events-none disabled:text-gray8",
            className,
          )}
          {...props}
        >
          {children}
        </motion.button>
      );
    }

    return (
      <div className="h-8 flex items-center">
        <motion.button
          ref={ref}
          className={cn(
            "bg-gray1 ring-1 shadow ring-neutral-950/15 flex items-center px-2.5 rounded-lg text-sm font-medium text-gray11 hover:bg-gray3 disabled:opacity-60 disabled:hover:bg-gray1 disabled:cursor-not-allowed",
            loading && "overflow-hidden shadow-none",
            className,
          )}
          whileTap={whileTap ?? { scale: 0.93 }}
          disabled={loading || disabled}
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
  },
);

export type IconButtonProps = {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
  className?: string;
  variant?: "solid" | "ghost";
} & Omit<MotionButtonProps, "children" | "onClick">;

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      onClick,
      label,
      children,
      className,
      variant = "solid",
      ...props
    },
    ref,
  ) {
    return (
      <motion.button
        ref={ref}
        type="button"
        onClick={onClick}
        className={cn(
          variant === "solid" &&
            "h-8 w-8 rounded-lg bg-gray1 flex items-center justify-center ring-1 shadow ring-neutral-950/15 hover:bg-gray3 text-gray11",
          variant === "ghost" &&
            "flex h-[22px] items-center justify-center text-gray10 cursor-pointer rounded border-0 bg-transparent px-2 py-1 hover:bg-gray7 disabled:pointer-events-none disabled:text-gray8",
          className,
        )}
        {...props}
      >
        <span className="sr-only">{label}</span>
        {children}
      </motion.button>
    );
  },
);

export const ResetButton = forwardRef<
  HTMLButtonElement,
  { onClick: () => void; label?: string }
>(function ResetButton({ onClick, label = "Reset" }, ref) {
  return (
    <IconButton ref={ref} onClick={onClick} label={label} variant="solid">
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
});
