import { serialize } from "next-mdx-remote/serialize";
import { readPage } from "../lib/fs";
import { Content } from "./content";

export default async function BezierCurvesPage() {
  const { content, length } = await readPage("bezier-curves");
  return <Content content={await serialize(content)} length={length} />;
}
