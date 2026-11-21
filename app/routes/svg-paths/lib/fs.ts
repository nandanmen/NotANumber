/**
 * Counts the sections of a page from its raw MDX source. A section is
 * delimited by "---".
 */
export const countSections = (source: string) => source.split("---").length;
