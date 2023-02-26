import React from "react";

const PageContext = React.createContext<{
  activeIndex: number;
  page: string;
  numSections: number;
  next: () => void;
  prev: () => void;
}>(null);

export const usePageContext = () => React.useContext(PageContext);

const order = ["01-commands", "02-cursors"];

export const PageProvider = ({ page, numSections, children }) => {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const next = React.useCallback(() => {
    if (activeIndex === numSections - 1) {
      const nextPage = order[order.indexOf(page) + 1];
      if (nextPage) {
        window.location.href = `/paths/${nextPage}`;
        return;
      }
    }
    setActiveIndex((i) => i + 1);
  }, [activeIndex, numSections, page]);

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
    <PageContext.Provider
      value={{ page, numSections, activeIndex, next, prev }}
    >
      {children}
    </PageContext.Provider>
  );
};
