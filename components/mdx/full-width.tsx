import { cn } from "~/lib/cn";

export function FullWidth({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("!col-start-1 col-span-3 !max-w-full", className)}>
      {children}
    </div>
  );
}
