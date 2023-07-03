import React from "react";
import { motion } from "framer-motion";
import { useStateContext } from "../state";
import { Line } from "app/svg-paths/components/svg/line";
import { Path } from "app/svg-paths/components/svg/path";
import { Circle } from "app/svg-paths/components/svg/circle";
import { AbsoluteCommand, Path as PathType } from "app/svg-paths/lib/path";
import { DraggableEndpoint } from "app/svg-paths/components/draggable-endpoint";
import { getDragHandlers } from "app/svg-paths/components/svg/drag-group";

const basket =
  "M 6.25 10 v 1.5 h -0.25 v 1 q 0 1 1 1 h 1 q 1 0 1 -1 v -1 h -3 m 2.75 0 v -1.5";

const curveIndices = [1, 2, 3];

export const components = { Chain };

function Chain() {
  const {
    data: { path, index, expanded, state },
    set,
  } = useStateContext("chain");

  const curves = path.absolute.filter(
    (c) => c.code === "C" || c.code === "S"
  ) as Array<AbsoluteCommand<"C"> | AbsoluteCommand<"S">>;

  const c = path.atAbsolute<"C">(1);
  const s1 = path.atAbsolute<"S">(2);
  const s2 = path.atAbsolute<"S">(3);

  const isHovering = curveIndices.includes(index);
  const firstReflection = getReflection(c.x, c.y, c.x2, c.y2);
  const secondReflection = getReflection(s1.x, s1.y, s1.x2, s1.y2);

  return (
    <g>
      <motion.g
        animate={{ opacity: isHovering ? 0.2 : 1 }}
        transition={{ type: false }}
      >
        <Line x1={c.x0} y1={c.y0} x2={c.x1} y2={c.y1} />
        <Line x1={c.x} y1={c.y} x2={c.x2} y2={c.y2} />
        <Line x1={s1.x2} y1={s1.y2} x2={s1.x} y2={s1.y} />
        <Line x1={s2.x2} y1={s2.y2} x2={s2.x} y2={s2.y} />
        <Line
          dashed
          x1={c.x}
          y1={c.y}
          x2={firstReflection.x1}
          y2={firstReflection.y1}
        />
        <Line
          dashed
          x1={s1.x}
          y1={s1.y}
          x2={secondReflection.x1}
          y2={secondReflection.y1}
        />
        <Circle cx={firstReflection.x1} cy={firstReflection.y1} />
        <Circle cx={secondReflection.x1} cy={secondReflection.y1} />
        <Path d={path.toPathString()} />
        <Path animate={{ opacity: expanded ? 1 : 0.2 }} d={basket} />
        <g>
          {curves.map((command, index) => {
            const { x0, y0, x, y } = command;
            const last = index === curves.length - 1;
            return (
              <g key={command.id}>
                <Circle cx={x0} cy={y0} variant="cursor" size="large" />
                {last && <Circle cx={x} cy={y} variant="cursor" size="large" />}
              </g>
            );
          })}
        </g>
        <DraggableEndpoint
          cx={c.x1}
          cy={c.y1}
          onPan={(x, y) => {
            set({ path: path.setAbsolute(1, { x1: x, y1: y }) });
          }}
          {...getDragHandlers({
            id: ["1.x1", "1.y1"],
            state,
            set,
          })}
        />
        <DraggableEndpoint
          cx={c.x2}
          cy={c.y2}
          onPan={(x, y) => {
            set({ path: path.setAbsolute(1, { x2: x, y2: y }) });
          }}
          {...getDragHandlers({
            id: ["1.x2", "1.y2"],
            state,
            set,
          })}
        />
        <DraggableEndpoint
          cx={s1.x2}
          cy={s1.y2}
          onPan={(x, y) => {
            set({ path: path.setAbsolute(2, { x2: x, y2: y }) });
          }}
          {...getDragHandlers({
            id: ["2.x2", "2.y2"],
            state,
            set,
          })}
        />
        <DraggableEndpoint
          cx={s2.x2}
          cy={s2.y2}
          onPan={(x, y) => {
            set({ path: path.setAbsolute(3, { x2: x, y2: y }) });
          }}
          {...getDragHandlers({
            id: ["3.x2", "3.y2"],
            state,
            set,
          })}
        />
      </motion.g>
      {isHovering && (
        <g>
          <Curve path={path} index={index} />
          <Path d={path.atAbsolute(index).toPathSection()} />
          <Circle
            variant="cursor"
            size="large"
            cx={path.atAbsolute(index).x0}
            cy={path.atAbsolute(index).y0}
          />
          <Circle
            variant="cursor"
            size="large"
            cx={path.atAbsolute(index).x}
            cy={path.atAbsolute(index).y}
          />
        </g>
      )}
    </g>
  );
}

function Curve({ path, index }: { path: PathType; index: number }) {
  const command = path.atAbsolute(index);
  if (command.code !== "C" && command.code !== "S") return null;
  if (command.code === "C")
    return <CurveCommand key={command.id} command={command} />;
  const lastCommand = path.atAbsolute(index - 1);
  if (lastCommand.code !== "C" && lastCommand.code !== "S") return null;
  return (
    <ShortcutCommand
      key={command.id}
      command={command}
      lastCommand={lastCommand}
    />
  );
}

function getReflection(x: number, y: number, x2: number, y2: number) {
  const dx = x - x2;
  const dy = y - y2;
  return {
    x1: x + dx,
    y1: y + dy,
  };
}

function ShortcutCommand({
  command,
  lastCommand,
}: {
  command: AbsoluteCommand<"S">;
  lastCommand: AbsoluteCommand<"C"> | AbsoluteCommand<"S">;
}) {
  const { x2, y2, x, y, x0, y0 } = command;
  const { x1, y1 } = getReflection(
    command.x0,
    command.y0,
    lastCommand.x2,
    lastCommand.y2
  );
  return (
    <g key={command.id}>
      <Line x1={x} y1={y} x2={x2} y2={y2} />
      <Line dashed x1={x0} y1={y0} x2={x1} y2={y1} />
      <Circle cx={x1} cy={y1} />
      <Circle variant="point" cx={x2} cy={y2} />
    </g>
  );
}

function CurveCommand({ command }: { command: AbsoluteCommand<"C"> }) {
  const { x, y, x1, y1, x2, y2, x0, y0 } = command;
  return (
    <g key={command.id}>
      <Line x1={x} y1={y} x2={x2} y2={y2} />
      <Line x1={x0} y1={y0} x2={x1} y2={y1} />
      <Circle variant="point" cx={x1} cy={y1} />
      <Circle variant="point" cx={x2} cy={y2} />
    </g>
  );
}

export const page = {
  children: <Chain />,
  svg: 15,
};
