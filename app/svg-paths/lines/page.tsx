import { serialize } from "next-mdx-remote/serialize";
import { readPage } from "../lib/fs";
import { LinesContent } from "./content";

export default async function LinesPage() {
  const { content, length } = await readPage("lines");
  return <LinesContent content={await serialize(content)} length={length} />;
}
