"use client";

import { useInView } from "framer-motion";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { useEffect, useRef } from "react";
import { annotate } from "rough-notation";
import { RoughAnnotationType } from "rough-notation/lib/model";
import { OrderedList } from "~/components/OrderedList";
import { AppendOnlyFile } from "./_components/append-only-file";
import { HardDrive } from "./_components/hard-drive";

const baseComponents = {
  h1: (props) => <h1 className="text-3xl font-medium" {...props} />,
  h2: (props) => <h2 className="text-2xl font-medium" {...props} />,
  h3: (props) => <h3 className="text-xl font-medium" {...props} />,
  strong: (props) => <strong className="font-medium" {...props} />,
  code: (props) => <code className="inline-code" {...props} />,
  pre: (props) => (
    <pre
      className="border border-gray8 bg-gray3 p-4 rounded-md overflow-x-auto text-sm"
      {...props}
    />
  ),
  ul: (props) => <ul className="list-disc pl-4" {...props} />,
  ol: OrderedList,
  hr: () => (
    <hr className="border-gray7 border-dashed -mx-10 my-5 !col-span-2" />
  ),
  a: (props) => (
    <a className="text-gray11 underline underline-offset-2" {...props} />
  ),
  AppendOnlyFile,
  InlineNote,
  Note,
  Annotation,
  HardDrive,
};

function Annotation({
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

function InlineNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative [&_[data-note]]:absolute [&_[data-note]]:left-full [&_[data-note]]:top-0 [&_[data-note]]:w-[200px] [&_[data-note]]:ml-6">
      {children}
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-sm font-handwriting text-green11" data-note>
      {children}
    </div>
  );
}

export function Mdx({ source }: { source: MDXRemoteSerializeResult }) {
  return <MDXRemote {...source} components={baseComponents} />;
}
