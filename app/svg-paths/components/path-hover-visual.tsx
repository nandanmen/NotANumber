import { motion } from "framer-motion";
import { PathSection, PathSectionPoint } from "./path-visualizer";
import { useStateContext } from "./state-context";
import { useSvgContext } from "./svg";

export function PathHoverVisual({ id, commands }) {
  const { useRelativeMotionValue } = useSvgContext();
  const { data } = useStateContext<{ active: number } | null>(id);
  const isHovering = typeof data?.active === "number";
  const activeCommand = commands[data?.active];
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
