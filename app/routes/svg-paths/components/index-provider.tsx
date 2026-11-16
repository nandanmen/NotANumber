"use client";

import React from "react";

const IndexContext = React.createContext<{
  index: number;
  numSections: number;
  next: () => void;
  prev: () => void;
  set: (index: number) => void;
}>(null);

export function IndexProvider({
  children,
  numSections = Number.POSITIVE_INFINITY,
}: {
  numSections?: number;
  children: React.ReactNode;
}) {
  const [index, setIndex] = React.useState(0);
  const next = React.useCallback(
    () => setIndex((i) => Math.min(i + 1, numSections - 1)),
    [numSections]
  );
  const prev = React.useCallback(() => setIndex((i) => Math.max(i - 1, 0)), []);
  return (
    <IndexContext.Provider
      value={{ index, numSections, next, prev, set: setIndex }}
    >
      {children}
    </IndexContext.Provider>
  );
}

export const useIndexContext = () => React.useContext(IndexContext);
