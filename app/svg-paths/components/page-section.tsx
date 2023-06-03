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
        "p-8 py-16 lg:p-16 lg:pb-32 max-w-[100vw] lg:min-h-[50vh] gap-y-6 lg:space-y-[1.5em] relative",
        "grid grid-cols-[min(100%,60ch)_1fr] lg:block",
        "before:border-gray8 before:border-t before:border-dashed before:absolute lg:before:right-0 before:left-0 before:top-0 before:w-1/4 first-of-type:before:hidden before:h-px"
      )}
    >
      {children}
    </section>
  );
}
