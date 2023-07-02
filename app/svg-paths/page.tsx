import type { Metadata } from "next";
import { serialize } from "next-mdx-remote/serialize";

import { Content } from "./index/content";
import { readPage } from "./lib/fs";

export const metadata: Metadata = {
  title: "A Deep Dive Into SVG Path Commands",
  description:
    "An interactive guide to understanding SVG paths and path commands.",
  authors: [
    {
      name: "Nanda Syahrasyad",
      url: "https://twitter.com/nandafyi",
    },
  ],
  twitter: {
    card: "summary_large_image",
    title: "A Deep Dive Into SVG Path Commands",
    description:
      "An interactive guide to understanding SVG paths and path commands.",
    creator: "@nandafyi",
  },
  openGraph: {
    title: "A Deep Dive Into SVG Path Commands",
    description:
      "An interactive guide to understanding SVG paths and path commands.",
    url: "https://nan.fyi/svg-paths",
    siteName: "Not a Number",
  },
};

export default async function SvgPathsPage() {
  const { content, length } = await readPage("index");
  return <Content content={await serialize(content)} length={length} />;
}
