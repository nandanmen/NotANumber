import { serialize } from "next-mdx-remote/serialize";
import { readPage } from "../lib/fs";
import { Content } from "./content";

export default async function ArcsPage() {
  const { content, length } = await readPage("arcs");
  return <Content content={await serialize(content)} length={length} />;
}
