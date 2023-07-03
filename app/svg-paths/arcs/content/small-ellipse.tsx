import { useStateContext } from "../state";
import { useSvgContext } from "app/svg-paths/components/svg";
import { Tooltip } from "app/svg-paths/components/svg/tooltip";
import { parsePath } from "app/svg-paths/lib/path";
import * as Arc from "./arc-sandbox";
import { SyntaxState } from "./types";

const path = parsePath("M 3 10 A 10 7.5 0 0 0 20 17");

export const initialState = { path };

export const components = { SmallEllipse };

function SmallEllipse() {
  const { getRelative } = useSvgContext();
  const { data, set } = useStateContext("small-ellipse");
  const { path } = data;
  const arc = path.atAbsolute<"A">(1);
  return (
    <>
      <Arc.Root {...(data as SyntaxState)} set={set}>
        <Arc.ScaledEllipse />
        <Arc.Ellipse />
        <Arc.XAxis />
        <Arc.YAxis />
        <Arc.Center />
        <Arc.Path />
        <Arc.Origin />
        <Arc.Endpoint />
      </Arc.Root>
      <Tooltip
        y={arc.cy + getRelative(1)}
        x={arc.cx + arc.rx / 2}
        placement="top"
      >
        {arc.rx.toFixed(1)}
      </Tooltip>
    </>
  );
}

export const page = {
  children: <SmallEllipse />,
};
