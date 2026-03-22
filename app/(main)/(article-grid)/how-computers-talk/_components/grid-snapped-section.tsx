"use client";

import {
  type CSSProperties,
  type HTMLAttributes,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { cn } from "~/lib/cn";

type SectionProps = HTMLAttributes<HTMLElement>;

export function Section({ className, style, ...props }: SectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [measuredHeight, setMeasuredHeight] = useState<number>();

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const element = sectionRef.current;

    const updateHeight = () => {
      const height = element.getBoundingClientRect().height;
      setMeasuredHeight(height);
    };

    updateHeight();

    const observer = new ResizeObserver(() => {
      updateHeight();
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={cn(
        "grid !col-start-1 grid-cols-subgrid col-span-3 auto-rows-min gap-y-5 leading-relaxed border-t border-dashed border-borderSoft py-[var(--grid-size)] [&>*]:col-start-2",
        className,
      )}
      style={
        {
          ...style,
        } as CSSProperties
      }
      {...props}
    />
  );
}
