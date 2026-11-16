import { type Metadata, toMeta } from "~/lib/meta";
import ogImage from "../../opengraph-image.png";
import MDXContent from "./page.mdx";
import { ArticleTitle } from "../article-title";

const description =
  "How does Framer Motion make layout changes look seamless? In this post, we're taking a deep dive into FLIP, the technique used by Framer Motion to animate changes in layout without sacrificing performance.";

const metadata: Metadata = {
  title: "Inside Framer's Magic Motion",
  description,
  authors: [
    {
      name: "Nanda Syahrasyad",
      url: "https://twitter.com/nandafyi",
    },
  ],
  twitter: {
    card: "summary_large_image",
    title: "Inside Framer's Magic Motion",
    description,
    creator: "@nandafyi",
  },
  openGraph: {
    title: "Inside Framer's Magic Motion",
    description,
    url: "https://nan.fyi/magic-motion",
    siteName: "Not a Number",
  },
};

export function meta() {
  return toMeta(metadata, { image: ogImage, themeColor: "#ededed" });
}

export default function MagicMotionLayout() {
  return (
    <>
      <ArticleTitle
        title="Inside Framer's Magic Motion"
        description="How does Framer Motion make layout changes look seamless?"
      />
      <MDXContent />
    </>
  );
}
