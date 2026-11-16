import { type Metadata, toMeta } from "~/lib/meta";
import { countSections } from "../lib/fs";
import ogImage from "./opengraph-image.png";
import MDXContent from "./page.mdx";
import source from "./page.mdx?raw";
import { Content } from "./content";

const metadata: Metadata = {
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

export function meta() {
  return toMeta(metadata, { image: ogImage });
}

const length = countSections(source);

export default function CubicCurvesPage() {
  return <Content length={length}><MDXContent /></Content>;
}
