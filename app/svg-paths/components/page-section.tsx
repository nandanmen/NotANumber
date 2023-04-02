import React from "react";
import { useIndexContext } from "./index-provider";

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
    const handleScroll = () => {
      if (ref.current) {
        const { top } = ref.current.getBoundingClientRect();
        if (top < window.innerHeight / 2) {
          set(index);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [index, set]);

  return (
    <section ref={ref} className="p-10 min-h-[50vh] space-y-[1em]">
      {children}
    </section>
  );
}
