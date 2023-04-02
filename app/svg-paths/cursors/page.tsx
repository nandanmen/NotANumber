import { serialize } from "next-mdx-remote/serialize";
import { MDX } from "../components/mdx";
import { readPage } from "../lib/fs";
import { Cursors } from "./cursors";

export default async function SvgPathsPage() {
  const { content, length } = await readPage("cursors");
  return (
    <MDX content={await serialize(content)} numSections={length}>
      <Cursors />
    </MDX>
  );
}
