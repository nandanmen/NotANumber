import { clsx } from "clsx";

export const CommandHighlight = ({
  commands,
  indices,
}: {
  commands: string[];
  indices: number[];
}) => {
  return (
    <ol className="border border-gray8 bg-gray3 px-4 py-3 rounded-md font-mono">
      {commands.map((command, i) => {
        return (
          <li
            key={command}
            className={clsx(
              indices.includes(i) &&
                "-mx-4 px-3 bg-gray6 border-l-4 border-gray8"
            )}
          >
            {command}
          </li>
        );
      })}
    </ol>
  );
};
