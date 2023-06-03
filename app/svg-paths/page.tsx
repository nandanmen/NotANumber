import { serialize } from "next-mdx-remote/serialize";

import { Content } from "./index/content";
import { readPage } from "./lib/fs";

export default async function SvgPathsPage() {
  const { content, length } = await readPage("index");
  return <Content content={await serialize(content)} length={length} />;
}
