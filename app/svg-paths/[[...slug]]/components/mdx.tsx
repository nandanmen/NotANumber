"use client";

import React from "react";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { PageSection } from "./page-section";
import { IndexProvider, useIndexContext } from "./index-provider";

const components = {
  h1: (props) => <h1 className="text-3xl font-bold mb-8" {...props} />,
  code: (props) => <code className="inline-code" {...props} />,
  pre: (props) => (
    <pre className="border border-gray8 bg-gray3 p-4 rounded-md" {...props} />
  ),
  ul: (props) => <ul className="list-disc ml-4" {...props} />,
  PageSection,
};

export const MDX = ({
  content,
  numSections,
  children,
}: {
  content: MDXRemoteSerializeResult;
  numSections: number;
  children?: React.ReactNode;
}) => {
  return (
    <IndexProvider numSections={numSections}>
      <article className="border-r border-gray8 divide-y divide-dashed divide-gray8 leading-7">
        <MDXRemote {...content} components={components} />
        <Footer />
      </article>
      <div className="h-[calc(100vh_-_theme(space.16))] sticky top-16 p-10 aspect-square flex items-center">
        {children}
      </div>
    </IndexProvider>
  );
};

const Footer = () => {
  const { next, prev, index, numSections } = useIndexContext();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        next();
      } else if (e.key === "ArrowLeft") {
        prev();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [next, prev]);

  return (
    <footer>
      <p>
        {index + 1} / {numSections}
      </p>
      <button onClick={prev}>Prev</button>
      <button onClick={next}>Next</button>
    </footer>
  );
};
