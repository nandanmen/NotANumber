import type { Path } from "app/svg-paths/lib/path";
import type { DragGroupState } from "../../components/svg/drag-group";

export type SyntaxState = {
  path: Path;
} & DragGroupState;
