import { useStateContext } from "app/svg-paths/components/state-context";
import { useSvgContext } from "app/svg-paths/components/svg";
import { Tooltip } from "app/svg-paths/components/svg/tooltip";
import { getArcCenter } from "app/svg-paths/components/utils";
import { parsePath } from "app/svg-paths/lib/path";
import * as Arc from "./arc-sandbox";
import { SyntaxState } from "./types";

const path = parsePath("M 3 10 A 10 7.5 0 0 0 20 17");

export const initialState = { path };

function SmallEllipse() {
  const { getRelative } = useSvgContext();
  const { data, set } = useStateContext<SyntaxState>("small-ellipse");
  const { path } = data;
  const arc = path.atAbsolute<"A">(1);
  const { cx, cy } = getArcCenter(arc);

  return (
    <>
      <Arc.Root {...data} set={set}>
        <Arc.ScaledEllipse />
        <Arc.Ellipse />
        <Arc.XAxis />
        <Arc.YAxis />
        <Arc.Center />
        <Arc.Path />
        <Arc.Origin />
        <Arc.Endpoint />
      </Arc.Root>
      <Tooltip y={cy + getRelative(1)} x={cx + arc.rx / 2} placement="top">
        {arc.rx.toFixed(1)}
      </Tooltip>
    </>
  );
}

export const page = {
  children: <SmallEllipse />,
};
