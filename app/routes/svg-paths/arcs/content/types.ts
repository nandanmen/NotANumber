import type { Path } from "~/routes/svg-paths/lib/path";
import type { DragGroupState } from "../../components/svg/drag-group";

export type SyntaxState = {
  path: Path;
} & DragGroupState;
