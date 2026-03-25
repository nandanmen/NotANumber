import { cn } from "~/lib/cn";

/** Same column as body copy, with horizontal bleed (not grid full-bleed). */
export function ArticleBleed({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("md:-mx-8", className)}>{children}</div>;
}
