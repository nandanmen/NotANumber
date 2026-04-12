export type StyleRow = { prop: string; value: string };

export type InspectedElement = {
  componentName: string;
  filePath: string;
  tailwindStyles: Array<{ className: string; rows: StyleRow[] }>;
  computedStyles: Array<{ group: string; rows: StyleRow[] }>;
};
