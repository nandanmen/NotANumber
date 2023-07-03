import { useStateContext } from "../state";
import { parsePath } from "app/svg-paths/lib/path";
import * as Arc from "./arc-sandbox";
import { SyntaxState } from "./types";

const path = parsePath("M 3 10 A 10 7.5 30 0 0 20 17");

export const initialState = {
  slice: [1],
  active: ["1.xAxisRotation"],
  path,
};

export const components = { Rotation };

function Rotation() {
  const { data, set } = useStateContext("rotation");
  return (
    <>
      <Arc.Root {...(data as unknown as SyntaxState)} set={set}>
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
