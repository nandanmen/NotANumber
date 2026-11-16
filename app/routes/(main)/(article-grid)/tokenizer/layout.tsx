import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ArticleTitle } from "../article-title";

export const metadata: Metadata = {
  title: "Rebuilding Babel: The Tokenizer",
  description:
    "How do you build a modern JavaScript compiler from scratch? In this post, we'll rebuild the first piece of a compiler: the tokenizer.",
  authors: [
    {
      name: "Nanda Syahrasyad",
      url: "https://twitter.com/nandafyi",
    },
  ],
  twitter: {
    card: "summary_large_image",
    title: "Rebuilding Babel: The Tokenizer",
    description:
      "How do you build a modern JavaScript compiler from scratch? In this post, we'll rebuild the first piece of a compiler: the tokenizer.",
    creator: "@nandafyi",
  },
  openGraph: {
    title: "Rebuilding Babel: The Tokenizer",
    description:
      "How do you build a modern JavaScript compiler from scratch? In this post, we'll rebuild the first piece of a compiler: the tokenizer.",
    url: "https://nan.fyi/tokenizer",
    siteName: "Not a Number",
  },
};

export default function TokenizerLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <ArticleTitle
        title="Rebuilding Babel: The Tokenizer"
        description="Rebuilding the first piece of a compiler: the tokenizer."
      />
      {children}
    </>
  );
}
