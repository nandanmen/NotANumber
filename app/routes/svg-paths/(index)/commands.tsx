import { Circle } from "../components/svg/circle";
import { Path } from "../components/svg/path";
import { createPath } from "../lib/path";
import { useStateContext } from "./state";

export function Commands() {
  const {
    data: { path, index },
  } = useStateContext("commands");
  const last = index === null ? path.commands.length : index + 1;
  return (
    <g>
      <Path
        d={createPath(path.commands).toPathString()}
        className="stroke-gray8 fill-none"
      />
      <g>
        {path.absolute.slice(0, last).map((command) => {
          return (
            <Path
              key={command.id}
              d={command.toPathSection()}
              animate={{ pathLength: 1 }}
              initial={{ pathLength: 0 }}
              transition={{ duration: 0.5 }}
            />
          );
        })}
      </g>
      <g>
        {path.absolute.map((command) => {
          return (
            <Circle
              key={command.id}
              cx={command.x}
              cy={command.y}
              variant="point"
            />
          );
        })}
      </g>
    </g>
  );
}

export const page = {
  svg: 25,
  children: <Commands />,
};
