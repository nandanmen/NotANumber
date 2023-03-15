"use client";

import React from "react";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { IndexProvider, PageSection, useIndexContext } from "./page-section";

const components = {
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
      <article className="border-r border-gray8 divide-y divide-dashed divide-gray8">
        <MDXRemote {...content} components={components} />
        <Footer />
      </article>
      <div className="h-full max-h-[100vh] sticky top-0 p-10 max-w-[100vh] mx-auto w-full flex items-center">
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
