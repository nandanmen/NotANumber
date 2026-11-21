import type { MouseEventHandler, ReactNode } from "react";
import cn from "clsx";

export type ButtonProps = {
  className?: string;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children?: ReactNode;
  shape?: "square";
};

export function Button({ className, disabled, onClick, children, shape }: ButtonProps) {
  return (
    <button
      className={cn(
        "w-fit flex items-center border-b-2 border-gray-4 bg-white ring ring-black/10 shadow rounded not-disabled:hover:bg-gray-2 disabled:cursor-not-allowed disabled:text-gray-8 h-10",
        shape === "square" ? "aspect-square justify-center" : "px-3",
        className,
      )}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
