import { toMeta } from "~/lib/meta";
import MDXContent from "./page.mdx";

// Previously the page's YAML frontmatter.
const title = 'What exactly is a "stack overflow"?';
const description = "It's more than a website.";

export function meta() {
  return toMeta({ title, description });
}

export default function StackOverflowPage() {
  return <MDXContent />;
}
