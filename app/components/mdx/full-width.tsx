import { cn } from "~/lib/cn";

export function FullWidth({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "full-width -mx-[var(--content-padding)] md:mx-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
