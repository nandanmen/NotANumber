import { type Metadata, toMeta } from "~/lib/meta";
import ogImage from "../../opengraph-image.png";
import MDXContent from "./page.mdx";
import { ArticleTitle } from "../article-title";

const metadata: Metadata = {
  title: "The Power of Keys in Framer Motion",
  description:
    "Exploring how to use the React key prop to power your Framer Motion animations.",
  authors: [
    {
      name: "Nanda Syahrasyad",
      url: "https://twitter.com/nandafyi",
    },
  ],
  twitter: {
    card: "summary_large_image",
    title: "The Power of Keys in Framer Motion",
    description:
      "Exploring how to use the React key prop to power your Framer Motion animations.",
    creator: "@nandafyi",
  },
  openGraph: {
    title: "The Power of Keys in Framer Motion",
    description:
      "Exploring how to use the React key prop to power your Framer Motion animations.",
    url: "https://nan.fyi/keys-in-framer-motion",
    siteName: "Not a Number",
  },
};

export function meta() {
  return toMeta(metadata, { image: ogImage, themeColor: "#ededed" });
}

export default function KeysInFramerMotionLayout() {
  return (
    <>
      <ArticleTitle
        title="The Power of Keys in Framer Motion"
        description="Exploring how to use the React key prop to power your Framer Motion animations."
      />
      <MDXContent />
    </>
  );
}
