import { motion } from "framer-motion";
import { AbsoluteCommand, type Path } from "../lib/path";
import { PathSection, PathSectionPoint } from "./path-visualizer";
import { useStateContext } from "./state-context";
import { useSvgContext } from "./svg";

export function PathHoverVisual({ source }: { source: string }) {
  const { data } =
    useStateContext<Record<string, { path: Path; index?: number }>>()(source);
  return <PathList commands={data.path.absolute} index={data.index} />;
}

export function PathList({
  commands,
  index,
}: {
  commands: AbsoluteCommand[];
  index?: number;
}) {
  const { useRelativeMotionValue } = useSvgContext();
  const isHovering = typeof index === "number";
  const activeCommand = commands[index];
  const circleR = useRelativeMotionValue(0.75);
  return (
    <>
      <g className={isHovering && "text-gray8"}>
        {commands.map((command) => {
          const getClassName = () => {
            if (command.code !== "M") return;
            return isHovering ? "stroke-gray8" : "stroke-gray10";
          };
          return (
            <g key={command.id}>
              <PathSection
                type="placeholder"
                command={command}
                className={getClassName()}
              />
            </g>
          );
        })}
        {commands.map((command) => {
          return (
            <g key={command.id}>
              <PathSectionPoint type="placeholder" command={command} />
            </g>
          );
        })}
      </g>
      {activeCommand && (
        <g>
          <motion.circle
            r={circleR}
            cx={activeCommand.x0}
            cy={activeCommand.y0}
            className={activeCommand.code === "M" && "fill-gray10"}
          />
          <PathSection type="placeholder" command={activeCommand} />
          <PathSectionPoint type="placeholder" command={activeCommand} />
        </g>
      )}
    </>
  );
}
