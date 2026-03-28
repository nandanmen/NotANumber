import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ArticleTitle } from "../article-title";

const description =
  "How does Framer Motion make layout changes look seamless? In this post, we're taking a deep dive into FLIP, the technique used by Framer Motion to animate changes in layout without sacrificing performance.";

export const metadata: Metadata = {
  title: "Inside Framer's Magic Motion",
  description,
  authors: [
    {
      name: "Nanda Syahrasyad",
      url: "https://twitter.com/nandafyi",
    },
  ],
  twitter: {
    card: "summary_large_image",
    title: "Inside Framer's Magic Motion",
    description,
    creator: "@nandafyi",
  },
  openGraph: {
    title: "Inside Framer's Magic Motion",
    description,
    url: "https://nan.fyi/magic-motion",
    siteName: "Not a Number",
  },
};

export default function MagicMotionLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <ArticleTitle
        title="Inside Framer's Magic Motion"
        description="How does Framer Motion make layout changes look seamless?"
      />
      {children}
    </>
  );
}
