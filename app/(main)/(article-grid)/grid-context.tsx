"use client";

import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

type GridContextValue = {
  gridSize: number | null;
  setGridSize: (size: number) => void;
};

const GridContext = createContext<GridContextValue | null>(null);

export function GridSizeProvider({ children }: { children: ReactNode }) {
  const [gridSize, setGridSizeState] = useState<number | null>(48);
  const setGridSize = useCallback((size: number) => setGridSizeState(size), []);
  return (
    <GridContext.Provider value={{ gridSize, setGridSize }}>
      {children}
    </GridContext.Provider>
  );
}

export function useGridSize() {
  const ctx = useContext(GridContext);
  if (!ctx) {
    throw new Error("useGridSize must be used within GridSizeProvider");
  }
  return ctx;
}
