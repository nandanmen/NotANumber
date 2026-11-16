import { type Metadata, toMeta } from "~/lib/meta";
import { countSections } from "../lib/fs";
import ogImage from "./opengraph-image.png";
import MDXContent from "./page.mdx";
import source from "./page.mdx?raw";
import { Content } from "./content";

const metadata: Metadata = {
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

export function meta() {
  return toMeta(metadata, { image: ogImage });
}

const length = countSections(source);

export default function BezierCurvesPage() {
  return <Content length={length}><MDXContent /></Content>;
}
