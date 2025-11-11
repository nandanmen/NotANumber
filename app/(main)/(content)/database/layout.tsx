import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Header } from "../header";

export const metadata: Metadata = {
  title: "Build Your Own Database",
  description:
    "A step-by-step guide to building a key-value database from scratch.",
  authors: [
    {
      name: "Nanda Syahrasyad",
      url: "https://twitter.com/nandafyi",
    },
  ],
  twitter: {
    card: "summary_large_image",
    title: "Build Your Own Database",
    description:
      "A step-by-step guide to building a key-value database from scratch.",
    creator: "@nandafyi",
  },
  openGraph: {
    title: "Build Your Own Database",
    description:
      "A step-by-step guide to building a key-value database from scratch.",
    url: "https://nan.fyi/database",
    siteName: "Not a Number",
  },
};

export default async function BuildADatabasePage({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Header
        title="Build Your Own Database"
        description="A step-by-step guide to building a key-value database from scratch."
      />
      {children}
    </>
  );
}
