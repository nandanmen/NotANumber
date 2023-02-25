import React from "react";

const PageContext = React.createContext<{
  activeIndex: number;
  next: () => void;
  prev: () => void;
}>(null);

export const usePageContext = () => React.useContext(PageContext);

export const PageProvider = ({ children }) => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  return (
    <PageContext.Provider
      value={{
        activeIndex,
        next: () => setActiveIndex(activeIndex + 1),
        prev: () => setActiveIndex(Math.max(0, activeIndex - 1)),
      }}
    >
      {children}
    </PageContext.Provider>
  );
};
