import { Metadata } from "next";
import { serialize } from "next-mdx-remote/serialize";
import { readPage } from "../lib/fs";
import { CursorsContent } from "./content";

export const metadata: Metadata = {
  title: "SVG Path Commands | Cursors",
  description: `The cursor is the "pen" that draws the path - but how does it work, and how does each command affect it?`,
  authors: [
    {
      name: "Nanda Syahrasyad",
      url: "https://twitter.com/nandafyi",
    },
  ],
  twitter: {
    card: "summary_large_image",
    title: "SVG Path Commands | Cursors",
    description: `The cursor is the "pen" that draws the path - but how does it work, and how does each command affect it?`,
    creator: "@nandafyi",
  },
  openGraph: {
    title: "SVG Path Commands | Cursors",
    description: `The cursor is the "pen" that draws the path - but how does it work, and how does each command affect it?`,
    url: "https://nan.fyi/svg-paths",
    siteName: "Not a Number",
  },
};

export default async function CursorsPage() {
  const { content, length } = await readPage("cursors");
  return <CursorsContent content={await serialize(content)} length={length} />;
}
