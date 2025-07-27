import { cn } from "~/lib/cn";

export function Wide({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("!max-w-[calc(100%+64px)] -mx-8", className)}>
      {children}
    </div>
  );
}
