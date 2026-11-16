import { type Metadata, toMeta } from "~/lib/meta";
import { countSections } from "../lib/fs";
import ogImage from "./opengraph-image.png";
import MDXContent from "./page.mdx";
import source from "./page.mdx?raw";
import { LinesContent } from "./content";

const metadata: Metadata = {
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

export function meta() {
  return toMeta(metadata, { image: ogImage });
}

const length = countSections(source);

export default function LinesPage() {
  return <LinesContent length={length}><MDXContent /></LinesContent>;
}
