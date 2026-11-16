import { type Metadata, toMeta } from "~/lib/meta";
import { countSections } from "../lib/fs";
import ogImage from "./opengraph-image.png";
import MDXContent from "./page.mdx";
import source from "./page.mdx?raw";
import { CursorsContent } from "./content";

const metadata: Metadata = {
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

export function meta() {
  return toMeta(metadata, { image: ogImage });
}

const length = countSections(source);

export default function CursorsPage() {
  return <CursorsContent length={length}><MDXContent /></CursorsContent>;
}
