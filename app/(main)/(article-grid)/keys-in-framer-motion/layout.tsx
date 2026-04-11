import type { ReactNode } from "react";
import type { Metadata } from "next";
import { ArticleTitle } from "../article-title";

export const metadata: Metadata = {
  title: "The Power of Keys in Framer Motion",
  description:
    "Exploring how to use the React key prop to power your Framer Motion animations.",
  authors: [
    {
      name: "Nanda Syahrasyad",
      url: "https://twitter.com/nandafyi",
    },
  ],
  twitter: {
    card: "summary_large_image",
    title: "The Power of Keys in Framer Motion",
    description:
      "Exploring how to use the React key prop to power your Framer Motion animations.",
    creator: "@nandafyi",
  },
  openGraph: {
    title: "The Power of Keys in Framer Motion",
    description:
      "Exploring how to use the React key prop to power your Framer Motion animations.",
    url: "https://nan.fyi/keys-in-framer-motion",
    siteName: "Not a Number",
  },
};

export default function KeysInFramerMotionLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <ArticleTitle
        title="The Power of Keys in Framer Motion"
        description="Exploring how to use the React key prop to power your Framer Motion animations."
      />
      {children}
    </>
  );
}
