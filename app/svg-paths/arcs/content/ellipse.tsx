import { Ripple } from "app/svg-paths/components/ripple";
import { useStateContext } from "../state";
import { useSvgContext } from "app/svg-paths/components/svg";
import {
  CoordinatesTooltip,
  Tooltip,
} from "app/svg-paths/components/svg/tooltip";
import { parsePath } from "app/svg-paths/lib/path";
import * as Arc from "./arc-sandbox";
import { createInitialState } from "../../components/svg/drag-group";

const path = parsePath("M 3 10 A 10 7.5 0 0 0 20 17");

export const initialState = {
  ...createInitialState(),
  blocklist: ["1.xAxisRotation", "1.largeArc", "1.sweep"],
  path,
};

export const components = { Ellipse };

function Ellipse() {
  const { getRelative } = useSvgContext();
  const { data, set } = useStateContext("ellipse");
  const { path } = data;
  const arc = path.atAbsolute<"A">(1);

  const isActive = (index: number, ...props: string[]) => {
    return props.some((prop) => data.active?.includes(`${index}.${prop}`));
  };

  return (
    <>
      <Arc.Root {...data} set={set}>
        <Arc.Ellipse
          animate={{ pathLength: 1 }}
          initial={{ pathLength: 0 }}
          transition={{ type: "spring", duration: 2, delay: 0.4 }}
        />
        <Ripple cx={arc.cx} cy={arc.cy} delay={0.4} color="fill-gray10">
          <Arc.Center />
        </Ripple>
        <Arc.XAxis
          animate={{ pathLength: 1 }}
          initial={{ pathLength: 0 }}
          transition={{ type: "spring", duration: 2, delay: 0.4 }}
        />
        <Arc.XAxisDragHandle
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
        />
        <Arc.YAxis
          animate={{ pathLength: 1 }}
          initial={{ pathLength: 0 }}
          transition={{ type: "spring", duration: 2, delay: 0.4 }}
        />
        <Arc.YAxisDragHandle
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
        />
        <Arc.Path
          animate={{ pathLength: 1 }}
          initial={{ pathLength: 0 }}
          transition={{ type: "spring", duration: 2, delay: 1.2 }}
        />
        <Ripple cx={arc.x0} cy={arc.y0}>
          <Arc.Origin />
        </Ripple>
        <Ripple cx={arc.x} cy={arc.y} delay={0.2}>
          <Arc.Endpoint />
        </Ripple>
      </Arc.Root>
      {isActive(0, "x", "y") && (
        <CoordinatesTooltip x={arc.x0} y={arc.y0} placement="top" />
      )}
      {isActive(1, "x", "y") && (
        <CoordinatesTooltip x={arc.x} y={arc.y} placement="bottom" />
      )}
      {isActive(1, "ry") && (
        <Tooltip
          x={arc.cx - getRelative(1)}
          y={arc.cy + arc.ry / 2}
          placement="left"
        >
          {arc.ry.toFixed(1)}
        </Tooltip>
      )}
      {isActive(1, "rx") && (
        <Tooltip
          y={arc.cy - getRelative(1)}
          x={arc.cx + arc.rx / 2}
          placement="top"
        >
          {arc.rx.toFixed(1)}
        </Tooltip>
      )}
    </>
  );
}

export const page = {
  children: <Ellipse />,
};
