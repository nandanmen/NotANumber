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
}: {
  content: MDXRemoteSerializeResult;
  numSections: number;
}) => {
  return (
    <IndexProvider numSections={numSections}>
      <MDXRemote {...content} components={components} />
      <Footer />
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
