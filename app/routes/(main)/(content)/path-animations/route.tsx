import { siteMetadata, toMeta } from "~/lib/meta";
import ogImage from "../../opengraph-image.png";
import MDXContent from "./page.mdx";
import { Header } from "../header";

export function meta() {
  return toMeta(siteMetadata, { image: ogImage, themeColor: "#ededed" });
}

export default function PathAnimationsLayout() {
  return (
    <>
      <Header
        title="Drawing Paths"
        description="A closer look at a common path animation."
      />
      <MDXContent />
    </>
  );
}
