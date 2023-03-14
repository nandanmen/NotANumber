import React from "react";

const IndexContext = React.createContext<{
  index: number;
  numSections: number;
  next: () => void;
  prev: () => void;
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
    <IndexContext.Provider value={{ index, numSections, next, prev }}>
      {children}
    </IndexContext.Provider>
  );
}

export function useIndexContext() {
  return React.useContext(IndexContext);
}

export function PageSection({
  index,
  children,
}: {
  index: number;
  children: React.ReactNode;
}) {
  const { index: activeIndex } = useIndexContext();
  if (index > activeIndex) return null;
  return <section>{children}</section>;
}
