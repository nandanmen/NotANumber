"use client";

import { useRef, useEffect } from "react";
import { useInView } from "framer-motion";
import { annotate } from "rough-notation";
import { RoughAnnotationType } from "rough-notation/lib/model";

export function Annotation({
  children,
  type,
}: {
  children: React.ReactNode;
  type: RoughAnnotationType;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const annotationRef = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    annotationRef.current = annotate(ref.current, { type, color: "#30A46C" });
  }, [type]);

  useEffect(() => {
    if (inView && annotationRef.current) {
      setTimeout(() => {
        annotationRef.current.show();
      }, 1000);
    }
  }, [inView]);

  return <span ref={ref}>{children}</span>;
}
