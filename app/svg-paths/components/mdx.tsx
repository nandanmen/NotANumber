"use client";

import React from "react";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { PageSection } from "./page-section";
import { IndexProvider, useIndexContext } from "./index-provider";

const baseComponents = {
  h1: (props) => <h1 className="text-3xl font-bold mb-8" {...props} />,
  h2: (props) => <h1 className="text-2xl font-bold" {...props} />,
  code: (props) => <code className="inline-code" {...props} />,
  pre: (props) => (
    <pre
      className="border border-gray8 bg-gray3 px-4 py-3 rounded-md"
      {...props}
    />
  ),
  ul: (props) => <ul className="list-disc ml-4" {...props} />,
  PageSection,
};

export const MDX = ({
  content,
  numSections,
  components,
  children,
}: {
  content: MDXRemoteSerializeResult;
  numSections: number;
  components?: Record<string, (props: unknown) => JSX.Element>;
  children?: React.ReactNode;
}) => {
  return (
    <IndexProvider numSections={numSections}>
      <article className="border-r border-gray8 leading-7">
        <MDXRemote
          {...content}
          components={{ ...baseComponents, ...components }}
        />
        <Footer />
      </article>
      <div className="h-screen sticky top-0 flex items-center justify-center">
        <div className="w-full max-w-[100vh] p-10">{children}</div>
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
