import { type Metadata, toMeta } from "~/lib/meta";
import { countSections } from "../lib/fs";
import ogImage from "./opengraph-image.png";
import MDXContent from "./page.mdx";
import source from "./page.mdx?raw";
import { Content } from "./content";

const metadata: Metadata = {
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

export function meta() {
  return toMeta(metadata, { image: ogImage });
}

const length = countSections(source);

export default function ChallengeLayout() {
  return <Content length={length}><MDXContent /></Content>;
}
