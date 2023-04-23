import { motion } from "framer-motion";
import { useStateContext } from "./state-context";

const mapCodeToHint = {
  M: "move",
  L: "line",
  v: "relative vertical line",
  q: "relative quadratic curve",
  m: "relative move",
};

export const CommandList = ({
  id,
  commands,
}: {
  id: string;
  commands: string;
}) => {
  const { set } = useStateContext(id);
  return (
    <motion.ol
      className="border border-gray8 bg-gray3 rounded-md p-1 font-mono leading-none"
      onHoverEnd={() => set(null)}
    >
      {commands
        .split("\n")
        .filter((command) => command.trim().length > 0)
        .map((command, index) => {
          const code = command.split(" ").at(0);
          return (
            <motion.li
              key={command}
              className="p-2 hover:bg-gray5 group rounded-[4px] flex justify-between items-center"
              onHoverStart={() => set({ active: index })}
              onHoverEnd={() => set(null)}
            >
              <span>{command.trim()}</span>
              <span className="text-sm text-gray11 opacity-0 group-hover:opacity-100">
                {mapCodeToHint[code]}
              </span>
            </motion.li>
          );
        })}
    </motion.ol>
  );
};
