import { serialize } from "next-mdx-remote/serialize";
import { readPage } from "../lib/fs";
import { Content } from "./content";

export default async function CubicCurvesPage() {
  const { content, length } = await readPage("cubic-curves");
  return <Content content={await serialize(content)} length={length} />;
}
