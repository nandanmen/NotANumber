import { serialize } from "next-mdx-remote/serialize";
import { readPage } from "../lib/fs";
import { CursorsContent } from "./content";

export default async function CursorsPage() {
  const { content, length } = await readPage("cursors");
  return <CursorsContent content={await serialize(content)} length={length} />;
}
