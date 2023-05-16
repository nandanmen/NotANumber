import { serialize } from "next-mdx-remote/serialize";
import { MDX } from "../components/mdx";
import { readPage } from "../lib/fs";

export default async function CubicCurvesPage() {
  const { content, length } = await readPage("cubic-curves");
  return <MDX content={await serialize(content)} numSections={length} />;
}