import { CubicPlayground } from "./cubic-playground";
import { useStateContext } from "../state";
import { Path } from "app/svg-paths/components/svg/path";
import { Circle } from "app/svg-paths/components/svg/circle";
import { Line } from "app/svg-paths/components/svg/line";

function CurveGeneral() {
  const { data, set } = useStateContext("syntax");
  return (
    <g>
      <g className="text-gray8">
        <Path d="M 5 13 Q 10 5 15 13" />
        <Line dashed className="stroke-current" x1="5" y1="13" x2="10" y2="5" />
        <Line
          dashed
          className="stroke-current"
          x1="15"
          y1="13"
          x2="10"
          y2="5"
        />
        <Circle
          className="fill-gray6"
          cx="10"
          cy="5"
          stroke="currentColor"
          variant="point"
        />
      </g>
      <CubicPlayground
        curve={data.path.atAbsolute(1)}
        onChange={({ curve }) => {
          set({
            path: data.path.setAbsolute(1, curve),
          });
        }}
      />
    </g>
  );
}

export const components = { CurveGeneral };

export const page = {
  children: <CurveGeneral />,
  svg: 20,
};
