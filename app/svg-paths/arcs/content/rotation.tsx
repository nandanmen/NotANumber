import { useStateContext } from "app/svg-paths/components/state-context";
import { useSvgContext } from "app/svg-paths/components/svg";
import { Tooltip } from "app/svg-paths/components/svg/tooltip";
import { parsePath } from "app/svg-paths/lib/path";
import * as Arc from "./arc-sandbox";
import { SyntaxState } from "./types";

const path = parsePath("M 3 10 A 10 7.5 30 0 0 20 17");

export const initialState = {
  slice: [1],
  active: ["1.xAxisRotation"],
  path,
};

function Rotation() {
  const { getRelative } = useSvgContext();
  const { data, set } = useStateContext<SyntaxState>("rotation");
  const { path } = data;
  const arc = path.atAbsolute<"A">(1);
  return (
    <>
      <Arc.Root {...data} set={set}>
        <Arc.ScaledEllipse />
        <Arc.Ellipse />
        <Arc.XAxis />
        <Arc.YAxis />
        <Arc.Center />
        <Arc.RotationAxis />
        <Arc.Angle />
        <Arc.AngleText />
        <Arc.Path />
        <Arc.Origin />
        <Arc.Endpoint />
      </Arc.Root>
    </>
  );
}

export const page = {
  children: <Rotation />,
};
