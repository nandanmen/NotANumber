import { cn } from "~/lib/cn";

export function Wide({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "-mx-6 !max-w-[calc(100%+48px)] md:!max-w-[calc(100%+64px)] md:-mx-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
