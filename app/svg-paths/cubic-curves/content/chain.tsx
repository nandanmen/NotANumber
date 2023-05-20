import { motion } from "framer-motion";
import { useSvgContext } from "app/svg-paths/components/svg";
import { type CommandWithCode, parsePath } from "app/svg-paths/utils";
import { AnimatedEndpoint } from "app/svg-paths/components/path-visualizer";

const baloon =
  "M 6 10 c 0 -2 -2 0 -2 -5 s 7 -5 7 0 s -2 3 -2 5 h -3 m 0.25 0 v 1.5 h -0.25 v 1 q 0 1 1 1 h 1 q 1 0 1 -1 v -1 h -3 m 2.75 0 v -1.5";

const parsedBaloon = parsePath(baloon);
const curves = parsedBaloon.filter((c) => c.code === "C") as Array<
  CommandWithCode<"C">
>;

function Chain() {
  const { getRelative } = useSvgContext();
  return (
    <g>
      <g>
        {curves.map((command) => {
          const { x1, y1, x2, y2, x, y, x0, y0 } = command;
          return (
            <motion.g
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              transition={{ delay: 0.8 }}
              className="text-gray10"
              key={command.id}
            >
              <line
                strokeWidth={getRelative(0.75)}
                stroke="currentColor"
                x1={x0}
                y1={y0}
                x2={x1}
                y2={y1}
              />
              <line
                strokeWidth={getRelative(0.75)}
                stroke="currentColor"
                x1={x}
                y1={y}
                x2={x2}
                y2={y2}
              />
              <circle
                fill="currentColor"
                r={getRelative(0.75)}
                cx={x1}
                cy={y1}
              />
              <circle
                fill="currentColor"
                r={getRelative(0.75)}
                cx={x2}
                cy={y2}
              />
            </motion.g>
          );
        })}
      </g>
      <motion.path
        strokeWidth={getRelative(1.25)}
        className="fill-none stroke-current"
        d={baloon}
        animate={{ pathLength: 1 }}
        initial={{ pathLength: 0 }}
        transition={{ duration: 1 }}
      />
      <g>
        {curves.map((command, index) => {
          const { x0, y0, x, y } = command;
          const last = index === curves.length - 1;
          return (
            <g key={command.id}>
              <AnimatedEndpoint cx={x0} cy={y0} delay={0.3 + index * 0.1} />
              {last && (
                <AnimatedEndpoint
                  cx={x}
                  cy={y}
                  delay={0.3 + index * 0.1 + 0.1}
                />
              )}
            </g>
          );
        })}
      </g>
    </g>
  );
}

export const page = {
  children: <Chain />,
  svg: 15,
};
