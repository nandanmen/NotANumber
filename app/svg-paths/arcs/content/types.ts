import type { Path } from "app/svg-paths/lib/path";
import type { DragGroupState } from "./drag-group";

export type SyntaxState = {
  path: Path;
} & DragGroupState;
