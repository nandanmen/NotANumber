import { getId } from "~/lib/utils";

export const Heading = ({ children }) => {
  const id = getId(children);
  return (
    <h2
      id={id}
      className="relative mt-24 mb-8 scroll-mt-16 font-serif text-[1.875rem] font-medium before:absolute before:-top-4 before:left-0 before:h-[3px] before:w-6 before:bg-current before:content-['']"
    >
      {children}
    </h2>
  );
};

export const Subheading = ({ children }) => {
  const id = getId(children);
  return (
    <h3 id={id} className="mt-8 mb-6 scroll-mt-28 text-[1.5rem] font-normal">
      {children}
    </h3>
  );
};
