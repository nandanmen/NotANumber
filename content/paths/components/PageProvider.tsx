import React from "react";

const PageContext = React.createContext<{
  activeIndex: number;
  next: () => void;
  prev: () => void;
}>(null);

export const usePageContext = () => React.useContext(PageContext);

export const PageProvider = ({ children }) => {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const next = React.useCallback(() => setActiveIndex((i) => i + 1), []);
  const prev = React.useCallback(
    () => setActiveIndex((i) => Math.max(0, i - 1)),
    []
  );

  React.useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [next, prev]);

  return (
    <PageContext.Provider value={{ activeIndex, next, prev }}>
      {children}
    </PageContext.Provider>
  );
};
