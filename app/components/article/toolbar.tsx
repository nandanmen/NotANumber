import type { ReactNode } from "react";
import cn from "clsx";
import { Button, type ButtonProps } from "./button";

type ToolbarProps = {
  children: ReactNode;
  className?: string;
};

function ToolbarRoot({ children, className }: ToolbarProps) {
  return (
    <div
      className={cn(
        "h-10 bg-white flex divide-x divide-black/10 w-fit ring ring-black/10 shadow rounded overflow-hidden",
        className,
      )}
    >
      {children}
    </div>
  );
}

function ToolbarButton({ className, ...props }: ButtonProps) {
  return <Button {...props} className={cn("ring-0 rounded-none shadow-none", className)} />;
}

export const Toolbar = Object.assign(ToolbarRoot, {
  Button: ToolbarButton,
});
