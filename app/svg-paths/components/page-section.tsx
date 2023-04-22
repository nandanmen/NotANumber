import React from "react";
import { useIndexContext } from "./index-provider";

const isVisible = (element: HTMLElement) => {
  const { top } = element.getBoundingClientRect();
  return top < window.innerHeight / 2;
};

export function PageSection({
  index,
  children,
}: {
  index: number;
  children: React.ReactNode;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { set } = useIndexContext();

  React.useEffect(() => {
    if (ref.current && isVisible(ref.current)) {
      set(index);
    }
  }, [index, set]);

  React.useEffect(() => {
    const handleScroll = () => {
      if (ref.current && isVisible(ref.current)) {
        set(index);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [index, set]);

  return (
    <section
      ref={ref}
      className="p-16 pb-32 min-h-[50vh] space-y-[1.5em] relative before:h-px before:border-gray8 before:border-t before:border-dashed before:absolute before:right-0 before:top-0 before:w-1/4 first-of-type:before:hidden"
    >
      {children}
    </section>
  );
}
