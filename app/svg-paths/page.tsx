import { serialize } from "next-mdx-remote/serialize";
import { MDX } from "./components/mdx";

import { Index } from "./index";
import { readPage } from "./lib/fs";

export default async function SvgPathsPage() {
  const { content, length } = await readPage("index");
  return (
    <MDX
      content={await serialize(content)}
      numSections={length}
      prefix={
        <>
          <h1 className="font-serif text-4xl mb-8">Understanding SVG Paths</h1>
          <p className="text-xl leading-relaxed">
            If you've ever looked at the SVG code for an icon before, you might
            have noticed that they're usually made up of a bunch of{" "}
            <code className="px-2 py-1 bg-gray6 rounded-md">path</code>{" "}
            elements, each with a cryptic{" "}
            <code className="px-2 py-1 bg-gray6 rounded-md">d</code> attribute.
          </p>
        </>
      }
    >
      <Index />
    </MDX>
  );
}
