import type { Metadata } from "next";
import { serialize } from "next-mdx-remote/serialize";

import { Content } from "./index/content";
import { readPage } from "./lib/fs";

export const metadata: Metadata = {
  title: "Understanding SVG Paths",
  description:
    "An interactive guide to understanding SVG paths and path commands.",
  authors: [
    {
      name: "Nanda Syahrasyad",
      url: "https://twitter.com/nandafyi",
    },
  ],
};

export default async function SvgPathsPage() {
  const { content, length } = await readPage("index");
  return <Content content={await serialize(content)} length={length} />;
}
