import { type Metadata, toMeta } from "~/lib/meta";
import ogImage from "./opengraph-image.png";
import MDXContent from "./page.mdx";
import { ArticleTitle } from "../article-title";

const metadata: Metadata = {
  title: "Build Your Own Database",
  description:
    "A step-by-step guide to building a key-value database from scratch.",
  authors: [
    {
      name: "Nanda Syahrasyad",
      url: "https://twitter.com/nandafyi",
    },
  ],
  twitter: {
    card: "summary_large_image",
    title: "Build Your Own Database",
    description:
      "A step-by-step guide to building a key-value database from scratch.",
    creator: "@nandafyi",
  },
  openGraph: {
    title: "Build Your Own Database",
    description:
      "A step-by-step guide to building a key-value database from scratch.",
    url: "https://nan.fyi/database",
    siteName: "Not a Number",
  },
};

export function meta() {
  return toMeta(metadata, { image: ogImage, themeColor: "#ededed" });
}

export default function BuildYourOwnDatabaseLayout() {
  return (
    <>
      <ArticleTitle
        title="Build Your Own Database"
        description="A step-by-step guide to building a key-value database from scratch."
      />
      <MDXContent />
    </>
  );
}
