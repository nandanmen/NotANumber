import { serialize } from "next-mdx-remote/serialize";
import { MDX } from "../components/mdx";
import { readPage } from "../lib/fs";

export default async function AnimationPage() {
  const { content, length } = await readPage("animation");
  return <MDX content={await serialize(content)} numSections={length} />;
}
