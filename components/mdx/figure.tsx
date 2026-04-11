import type { ReactNode } from "react";

export function Figure({ children }: { children: ReactNode }) {
  return (
    <figure className="grid grid-cols-subgrid full-width article">
      {children}
    </figure>
  );
}
