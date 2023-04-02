import * as fs from "fs/promises";

export const readPage = async (path: string) => {
  const source = await fs.readFile(
    `${process.cwd()}/app/svg-paths/${path}/index.mdx`,
    "utf8"
  );
  return splitPage(source);
};

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
