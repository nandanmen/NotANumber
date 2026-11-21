import { type Metadata, toMeta } from "~/lib/meta";
import ogImage from "../../opengraph-image.png";
import MDXContent from "./page.mdx";
import { ArticleTitle } from "../article-title";

const metadata: Metadata = {
  title: "Rebuilding Babel: The Tokenizer",
  description:
    "How do you build a modern JavaScript compiler from scratch? In this post, we'll rebuild the first piece of a compiler: the tokenizer.",
  authors: [
    {
      name: "Nanda Syahrasyad",
      url: "https://twitter.com/nandafyi",
    },
  ],
  twitter: {
    card: "summary_large_image",
    title: "Rebuilding Babel: The Tokenizer",
    description:
      "How do you build a modern JavaScript compiler from scratch? In this post, we'll rebuild the first piece of a compiler: the tokenizer.",
    creator: "@nandafyi",
  },
  openGraph: {
    title: "Rebuilding Babel: The Tokenizer",
    description:
      "How do you build a modern JavaScript compiler from scratch? In this post, we'll rebuild the first piece of a compiler: the tokenizer.",
    url: "https://nan.fyi/tokenizer",
    siteName: "Not a Number",
  },
};

export function meta() {
  return toMeta(metadata, { image: ogImage, themeColor: "#ededed" });
}

export default function TokenizerLayout() {
  return (
    <>
      <ArticleTitle
        title="Rebuilding Babel: The Tokenizer"
        description="Rebuilding the first piece of a compiler: the tokenizer."
      />
      <MDXContent />
    </>
  );
}
