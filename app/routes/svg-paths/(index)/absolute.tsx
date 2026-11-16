import { Text } from "../components/svg/text";
import { Circle } from "../components/svg/circle";
import { Line } from "../components/svg/line";
import { CoordinatesTooltip } from "../components/svg/tooltip";
import { Page } from "../components/visual-wrapper";
import { useStateContext } from "./state";

export function Absolute() {
  const {
    data: { path },
  } = useStateContext("absolute");
  const line = path.atAbsolute(1);
  const relativeLine = path.atAbsolute(3);
  return (
    <g>
      <g className="text-blue9">
        <Line
          x1={line.x0}
          y1={line.y0}
          x2={line.x}
          y2={line.y}
          size="xl"
          variant="current"
        />
        <Circle cx={line.x} cy={line.y} variant="point" />
        <Text x="9" y="7" fontSize={3} variant="current">
          L 5 5
        </Text>
      </g>
      <g className="text-green9">
        <Line
          x1={relativeLine.x0}
          y1={relativeLine.y0}
          x2={relativeLine.x}
          y2={relativeLine.y}
          size="xl"
          variant="current"
        />
        <Circle cx={relativeLine.x} cy={relativeLine.y} variant="point" />
        <Text x="11" y="13" fontSize={3} variant="current">
          l 5 5
        </Text>
      </g>
      <Circle cx={line.x0} cy={line.y0} variant="point" />
      <CoordinatesTooltip x={line.x} y={line.y} />
      <CoordinatesTooltip
        x={relativeLine.x}
        y={relativeLine.y}
        placement="bottom"
      />
    </g>
  );
}

export const page: Page = {
  svg: 20,
  children: <Absolute />,
};
