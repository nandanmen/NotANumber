import { type Metadata, toMeta } from "~/lib/meta";
import { countSections } from "../lib/fs";
import ogImage from "./opengraph-image.png";
import MDXContent from "./page.mdx";
import source from "./page.mdx?raw";
import { Content } from "./content";

const metadata: Metadata = {
  title: "SVG Path Commands | Arcs",
  description: `The arc command is the least intuitive of the SVG path commands; let's take a look at how to use it to draw arcs.`,
  authors: [
    {
      name: "Nanda Syahrasyad",
      url: "https://twitter.com/nandafyi",
    },
  ],
  twitter: {
    card: "summary_large_image",
    title: "SVG Path Commands | Arcs",
    description: `The arc command is the least intuitive of the SVG path commands; let's take a look at how to use it to draw arcs.`,
    creator: "@nandafyi",
  },
  openGraph: {
    title: "SVG Path Commands | Arcs",
    description: `The arc command is the least intuitive of the SVG path commands; let's take a look at how to use it to draw arcs.`,
    url: "https://nan.fyi/svg-paths",
    siteName: "Not a Number",
  },
};

export function meta() {
  return toMeta(metadata, { image: ogImage });
}

const length = countSections(source);

export default function ArcsPage() {
  return <Content length={length}><MDXContent /></Content>;
}
