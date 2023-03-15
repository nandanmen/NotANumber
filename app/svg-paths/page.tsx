import * as fs from "fs/promises";
import { serialize } from "next-mdx-remote/serialize";
import { MDX } from "./mdx";
import { PathVisualizer } from "./path-visualizer";
import { Svg } from "./svg";

export default async function SvgPathsPage() {
  const source = await fs.readFile("./app/svg-paths/content.mdx", "utf8");
  const { content, length } = splitPage(source);
  return (
    <MDX content={await serialize(content)} numSections={length}>
      <Svg size={25}>
        <PathVisualizer command="M 22 17 v 3 a 2 2 0 0 1 -2 2 a 20 20 0 0 1 -9 -3 a 20 20 0 0 1 -6 -6 a 20 20 0 0 1 -3 -9 A 2 2 0 0 1 4 2 h 3 a 2 2 0 0 1 2 2 a 13 13 0 0 0 1 3 a 2 2 0 0 1 -1 2 L 8 10 a 16 16 0 0 0 6 6 l 1 -1 a 2 2 0 0 1 2 -1 a 13 13 0 0 0 3 1 A 2 2 0 0 1 22 17 Z" />
      </Svg>
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
