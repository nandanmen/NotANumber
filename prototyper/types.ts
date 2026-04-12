export type InspectedElement = {
  componentName: string;
  filePath: string;
  /** Resolved CSS declarations (property name → value) for the inspector. */
  styles: Record<string, string>;
};
