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
        "-mx-[var(--content-padding)] w-[calc(100%+2*var(--content-padding))] md:w-full max-w-[964px] md:mx-auto md:!col-start-1 md:col-span-3",
        className,
      )}
    >
      {children}
    </div>
  );
}
