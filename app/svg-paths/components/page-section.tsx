import React from "react";
import { clsx } from "clsx";
import { useIndexContext } from "./index-provider";
import styles from "./page-section.module.css";

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
      className={clsx(
        styles.section,
        "p-8 pb-16 pt-0 lg:px-16 lg:pb-32 max-w-[100vw] lg:min-h-[50vh] gap-y-6 lg:space-y-[1.5em] relative group first-of-type:pt-16",
        "grid grid-cols-[1fr_min(100%,60ch)_1fr] lg:block first-of-type:-mt-16"
      )}
    >
      <hr className="border-gray8 border-dashed mb-10 lg:mb-16 lg:w-1/3 group-first-of-type:hidden" />
      {children}
    </section>
  );
}
