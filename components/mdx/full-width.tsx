export function FullWidth({ children }: { children: React.ReactNode }) {
  return <div className="!col-start-1 col-span-3 !max-w-full">{children}</div>;
}
