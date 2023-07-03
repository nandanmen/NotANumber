import { Metadata } from "next";
import { serialize } from "next-mdx-remote/serialize";
import { readPage } from "../lib/fs";
import { LinesContent } from "./content";

export const metadata: Metadata = {
  title: "SVG Path Commands | Lines",
  description: `The L, or line, command is the simplest command out of all the path commands. Let's take a look at how it works.`,
  authors: [
    {
      name: "Nanda Syahrasyad",
      url: "https://twitter.com/nandafyi",
    },
  ],
  twitter: {
    card: "summary_large_image",
    title: "SVG Path Commands | Lines",
    description: `The L, or line, command is the simplest command out of all the path commands. Let's take a look at how it works.`,
    creator: "@nandafyi",
  },
  openGraph: {
    title: "SVG Path Commands | Lines",
    description: `The L, or line, command is the simplest command out of all the path commands. Let's take a look at how it works.`,
    url: "https://nan.fyi/svg-paths",
    siteName: "Not a Number",
  },
};

export default async function LinesPage() {
  const { content, length } = await readPage("lines");
  return <LinesContent content={await serialize(content)} length={length} />;
}
