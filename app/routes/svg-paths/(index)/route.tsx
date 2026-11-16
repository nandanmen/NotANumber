import { type Metadata, toMeta } from "~/lib/meta";
import { countSections } from "../lib/fs";
import ogImage from "../opengraph-image.png";
import MDXContent from "./page.mdx";
import source from "./page.mdx?raw";
import { IndexContent } from "./content";

const metadata: Metadata = {
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

export function meta() {
  return toMeta(metadata, { image: ogImage });
}

const length = countSections(source);

export default function SvgPathsPage() {
  return (
    <IndexContent length={length}>
      <MDXContent />
    </IndexContent>
  );
}
