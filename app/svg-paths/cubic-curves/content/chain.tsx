import { motion } from "framer-motion";
import { useSvgContext } from "app/svg-paths/components/svg";
import { type CommandWithCode, parsePath } from "app/svg-paths/utils";
import { AnimatedEndpoint } from "app/svg-paths/components/path-visualizer";
import { useStateContext } from "app/svg-paths/components/state-context";
import { DraggableEndpoint } from "app/svg-paths/components/draggable-endpoint";

const baloon = "M 6 10 c 0 -2 -2 0 -2 -5 s 7 -5 7 0 s -2 3 -2 5 z";

const basket =
  "M 6.25 10 v 1.5 h -0.25 v 1 q 0 1 1 1 h 1 q 1 0 1 -1 v -1 h -3 m 2.75 0 v -1.5";

const parsedBaloon = parsePath(baloon);
const curves = parsedBaloon.filter(
  (c) => c.code === "C" || c.code === "S"
) as Array<CommandWithCode<"C"> | CommandWithCode<"S">>;

function Chain() {
  const {
    data: { index, expanded },
  } = useStateContext<{ index: number; expanded: boolean }>("chain");
  const { getRelative } = useSvgContext();
  return (
    <g>
      <g>
        {curves.map((command, index) => {
          if (command.code === "C")
            return <CurveCommand key={command.id} command={command} />;
          const lastCommand = curves.at(index - 1);
          return (
            <ShortcutCommand
              key={command.id}
              command={command}
              lastCommand={lastCommand}
            />
          );
        })}
      </g>
      <g strokeWidth={getRelative(1.25)} className="fill-none stroke-current">
        <path d={baloon} />
        <motion.path animate={{ opacity: expanded ? 1 : 0.2 }} d={basket} />
      </g>
      <g>
        {curves.map((command, index) => {
          const { x0, y0, x, y } = command;
          const last = index === curves.length - 1;
          return (
            <g key={command.id} fill="currentColor">
              <circle cx={x0} cy={y0} r={getRelative(1.2)} />
              {last && <circle cx={x} cy={y} r={getRelative(1.2)} />}
            </g>
          );
        })}
      </g>
    </g>
  );
}

function getReflection(
  lastCommand: CommandWithCode<"C"> | CommandWithCode<"S">
) {
  const { x, y, x2, y2 } = lastCommand;
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
  command: CommandWithCode<"S">;
  lastCommand: CommandWithCode<"C"> | CommandWithCode<"S">;
}) {
  const { getRelative } = useSvgContext();
  const { x2, y2, x, y, x0, y0 } = command;
  const { x1, y1 } = getReflection(lastCommand);
  return (
    <motion.g key={command.id}>
      <line
        className="text-gray10"
        strokeWidth={getRelative(0.5)}
        stroke="currentColor"
        x1={x}
        y1={y}
        x2={x2}
        y2={y2}
      />
      <g className="text-gray9">
        <line
          strokeWidth={getRelative(0.5)}
          stroke="currentColor"
          strokeDasharray={getRelative(1)}
          x1={x0}
          y1={y0}
          x2={x1}
          y2={y1}
        />
        <circle fill="currentColor" r={getRelative(1)} cx={x1} cy={y1} />
      </g>
      <DraggableEndpoint cx={x2} cy={y2} on={{}} />
    </motion.g>
  );
}

function CurveCommand({ command }: { command: CommandWithCode<"C"> }) {
  const { getRelative } = useSvgContext();
  const { x, y, x1, y1, x2, y2, x0, y0 } = command;
  return (
    <motion.g key={command.id}>
      <g
        className="text-gray10"
        strokeWidth={getRelative(0.5)}
        stroke="currentColor"
      >
        <line x1={x} y1={y} x2={x2} y2={y2} />
        <line x1={x0} y1={y0} x2={x1} y2={y1} />
      </g>
      <DraggableEndpoint cx={x1} cy={y1} on={{}} />
      <DraggableEndpoint cx={x2} cy={y2} on={{}} />
    </motion.g>
  );
}

export const page = {
  children: <Chain />,
  svg: 15,
};
