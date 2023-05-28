import { animate, easeInOut } from "popmotion";
import { Text } from "app/svg-paths/components/path-visualizer";
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

const path = parsePath("M 3 10 A 10 7.5 0 0 0 20 17");

export const initialState = {
  path,
};

function SmallEllipse() {
  const { getRelative } = useSvgContext();
  const { data, set } = useStateContext<SyntaxState>("small-ellipse");
  const { path } = data;
  const arc = path.atAbsolute<"A">(1);
  const { cx, cy } = getArcCenter(arc);

  return (
    <>
      <ArcSandbox {...data} set={set} />
      <Tooltip y={cy - getRelative(1)} x={cx + arc.rx / 2} placement="top">
        {arc.rx.toFixed(1)}
      </Tooltip>
    </>
  );
}

export const page = {
  children: <SmallEllipse />,
};
