import { serialize } from "next-mdx-remote/serialize";
import { MDX } from "./components/mdx";

import { Index } from "./index";
import { readPage } from "./lib/fs";

export default async function SvgPathsPage() {
  const { content, length } = await readPage("index");
  return (
    <MDX content={await serialize(content)} numSections={length}>
      <Index />
    </MDX>
  );
}
