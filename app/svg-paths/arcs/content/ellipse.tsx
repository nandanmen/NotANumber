import { useStateContext } from "app/svg-paths/components/state-context";
import { useSvgContext } from "app/svg-paths/components/svg";
import {
  CoordinatesTooltip,
  Tooltip,
} from "app/svg-paths/components/svg/tooltip";
import { getArcCenter } from "app/svg-paths/components/utils";
import { parsePath } from "app/svg-paths/lib/path";
import { ArcSandbox } from "./arc-sandbox";
import { createInitialState } from "./drag-group";
import { SyntaxState } from "./types";

const path = parsePath("M 3 10 A 10 7.5 0 0 0 20 15");

export const initialState = {
  ...createInitialState(),
  blocklist: ["1.xAxisRotation", "1.largeArc", "1.sweep"],
  path,
};

function Ellipse() {
  const { getRelative } = useSvgContext();
  const { data, set } = useStateContext<SyntaxState>("ellipse");
  const { path } = data;
  const arc = path.atAbsolute<"A">(1);
  const { cx, cy } = getArcCenter(arc);
  return (
    <>
      <ArcSandbox {...data} set={set} />
      <CoordinatesTooltip x={arc.x0} y={arc.y0} placement="top" />
      <CoordinatesTooltip x={arc.x} y={arc.y} placement="bottom" />
      <Tooltip x={cx - getRelative(1)} y={cy + arc.ry / 2} placement="left">
        {arc.ry.toFixed(1)}
      </Tooltip>
      <Tooltip y={cy - getRelative(1)} x={cx + arc.rx / 2} placement="top">
        {arc.rx.toFixed(1)}
      </Tooltip>
    </>
  );
}

export const page = {
  children: <Ellipse />,
};
