import { Metadata } from "next";
import { serialize } from "next-mdx-remote/serialize";
import { readPage } from "../lib/fs";
import { Content } from "./content";

export const metadata: Metadata = {
  title: "SVG Path Commands | Challenges",
  description: `Build a better intuition of SVG paths by tracing over eight beautiful icons courtesy of the Iconist's Central icon system.`,
  authors: [
    {
      name: "Nanda Syahrasyad",
      url: "https://twitter.com/nandafyi",
    },
  ],
  twitter: {
    card: "summary_large_image",
    title: "SVG Path Commands | Challenges",
    description: `Build a better intuition of SVG paths by tracing over eight beautiful icons courtesy of the Iconist's Central icon system.`,
    creator: "@nandafyi",
  },
  openGraph: {
    title: "SVG Path Commands | Challenges",
    description: `Build a better intuition of SVG paths by tracing over eight beautiful icons courtesy of the Iconist's Central icon system.`,
    url: "https://nan.fyi/svg-paths",
    siteName: "Not a Number",
  },
};

export default async function ChallengePage() {
  const { content, length } = await readPage("challenge");
  return <Content content={await serialize(content)} length={length} />;
}
