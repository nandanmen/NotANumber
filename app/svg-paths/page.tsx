import * as fs from "fs/promises";
import { serialize } from "next-mdx-remote/serialize";
import { MDX } from "./mdx";
import { Svg } from "./svg";

export default async function SvgPathsPage() {
  const source = await fs.readFile("./app/svg-paths/content.mdx", "utf8");
  const { content, length } = splitPage(source);
  return (
    <MDX content={await serialize(content)} numSections={length}>
      <Svg size={50}></Svg>
    </MDX>
  );
}

/**
 * Wraps each section of the page in a PageSection component. A section is
 * delimited by "---".
 */
const splitPage = (page: string) => {
  const sections = page.split("---");
  const parts = sections.flatMap((section, index) => {
    if (index === sections.length - 1) return [section];
    return [section, `</PageSection>\n\n<PageSection index={${index + 1}}>`];
  });
  parts.unshift("<PageSection index={0}>\n\n");
  parts.push("\n</PageSection>");
  return {
    content: parts.join(""),
    length: sections.length,
  };
};
