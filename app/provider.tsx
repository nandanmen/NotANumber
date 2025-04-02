"use client";

import { Provider as JotaiProvider } from "jotai";

export function Provider({ children }: { children: React.ReactNode }) {
  return <JotaiProvider>{children}</JotaiProvider>;
}
