import { Metadata } from "next";
import { serialize } from "next-mdx-remote/serialize";
import { readPage } from "../lib/fs";
import { Content } from "./content";

export const metadata: Metadata = {
  title: "SVG Path Commands | Cubic Curves",
  description: `The cubic bezier curve is a curve type that lets you draw curves with more control. How does it work, and how does it differ from the bezier curves we just saw?`,
  authors: [
    {
      name: "Nanda Syahrasyad",
      url: "https://twitter.com/nandafyi",
    },
  ],
  twitter: {
    card: "summary_large_image",
    title: "SVG Path Commands | Cubic Curves",
    description: `The cubic bezier curve is a curve type that lets you draw curves with more control. How does it work, and how does it differ from the bezier curves we just saw?`,
    creator: "@nandafyi",
  },
  openGraph: {
    title: "SVG Path Commands | Cubic Curves",
    description: `The cubic bezier curve is a curve type that lets you draw curves with more control. How does it work, and how does it differ from the bezier curves we just saw?`,
    url: "https://nan.fyi/svg-paths",
    siteName: "Not a Number",
  },
};

export default async function CubicCurvesPage() {
  const { content, length } = await readPage("cubic-curves");
  return <Content content={await serialize(content)} length={length} />;
}
