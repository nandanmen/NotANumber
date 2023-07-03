import { Metadata } from "next";
import { serialize } from "next-mdx-remote/serialize";
import { readPage } from "../lib/fs";
import { Content } from "./content";

export const metadata: Metadata = {
  title: "SVG Path Commands | Bezier Curves",
  description: `The real power of SVG paths lies in its ability to draw curves. Let's take a look at the first type of curve: the quadratic bezier curve.`,
  authors: [
    {
      name: "Nanda Syahrasyad",
      url: "https://twitter.com/nandafyi",
    },
  ],
  twitter: {
    card: "summary_large_image",
    title: "SVG Path Commands | Bezier Curves",
    description: `The real power of SVG paths lies in its ability to draw curves. Let's take a look at the first type of curve: the quadratic bezier curve.`,
    creator: "@nandafyi",
  },
  openGraph: {
    title: "SVG Path Commands | Bezier Curves",
    description: `The real power of SVG paths lies in its ability to draw curves. Let's take a look at the first type of curve: the quadratic bezier curve.`,
    url: "https://nan.fyi/svg-paths",
    siteName: "Not a Number",
  },
};

export default async function BezierCurvesPage() {
  const { content, length } = await readPage("bezier-curves");
  return <Content content={await serialize(content)} length={length} />;
}
