"use client";

import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { AppendOnlyFile } from "./_components/append-only-file";

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
  ol: (props) => <ol className="list-decimal pl-4" {...props} />,
  hr: () => (
    <hr className="border-gray7 border-dashed -mx-10 my-5 !col-span-2" />
  ),
  AppendOnlyFile,
};

export function Mdx({ source }: { source: MDXRemoteSerializeResult }) {
  return <MDXRemote {...source} components={baseComponents} />;
}
