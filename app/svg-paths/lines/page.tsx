import { serialize } from "next-mdx-remote/serialize";
import { MDX } from "../components/mdx";
import { readPage } from "../lib/fs";

export default async function LinesPage() {
  const { content, length } = await readPage("lines");
  return <MDX content={await serialize(content)} numSections={length} />;
}
