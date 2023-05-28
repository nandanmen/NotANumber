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
  ...createInitialState(),
  blocklist: ["1.xAxisRotation", "1.largeArc", "1.sweep"],
  path,
};

function SmallEllipse() {
  const { getRelative } = useSvgContext();
  const { data, set } = useStateContext<SyntaxState>("small-ellipse");
  const { path } = data;
  const arc = path.atAbsolute<"A">(1);
  const { cx, cy } = getArcCenter(arc);

  const isActive = (index: number, ...props: string[]) => {
    return props.some((prop) => data.active?.includes(`${index}.${prop}`));
  };

  return (
    <>
      <ArcSandbox {...data} set={set} />
      {isActive(0, "x", "y") && (
        <CoordinatesTooltip x={arc.x0} y={arc.y0} placement="top" />
      )}
      {isActive(1, "x", "y") && (
        <CoordinatesTooltip x={arc.x} y={arc.y} placement="bottom" />
      )}
      {isActive(1, "ry") && (
        <Tooltip x={cx - getRelative(1)} y={cy + arc.ry / 2} placement="left">
          {arc.ry.toFixed(1)}
        </Tooltip>
      )}
      {isActive(1, "rx") && (
        <Tooltip y={cy - getRelative(1)} x={cx + arc.rx / 2} placement="top">
          {arc.rx.toFixed(1)}
        </Tooltip>
      )}
      <g>
        <Text
          x="5"
          y="2"
          onClick={() => {
            set({ active: ["1.rx"] });
            animate({
              from: arc.rx,
              to: 6.5,
              ease: easeInOut,
              duration: 1500,
              onUpdate: (rx) => {
                set({ path: path.set(1, { rx }) });
              },
              onComplete: () => set({ active: [] }),
            });
          }}
        >
          Click me
        </Text>
      </g>
    </>
  );
}

export const page = {
  children: <SmallEllipse />,
};
