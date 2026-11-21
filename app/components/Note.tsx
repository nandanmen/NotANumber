export const Root = ({ children }) => {
  return (
    <div className="note relative grid grid-cols-[min(100%,65ch)_1fr] [&>*]:col-start-1 [&>:not(:first-child,aside)]:mt-4 [&>aside]:mt-4 md:[&>aside]:col-start-2 md:[&>aside]:row-span-full md:[&>aside]:mt-0">
      {children}
    </div>
  );
};

export const Content = ({ children }) => {
  return (
    <aside className="text-gray11 md:absolute md:pl-4 md:text-[0.875rem]">
      {children}
    </aside>
  );
};
