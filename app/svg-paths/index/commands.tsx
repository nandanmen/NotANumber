import { Path } from "../components/svg/path";
import { createPath } from "../lib/path";
import { useStateContext } from "./state";

export function Commands() {
  const {
    data: { path, index },
  } = useStateContext("commands");
  const last = index === null ? path.commands.length : index + 1;
  return <Path d={createPath(path.commands.slice(0, last)).toPathString()} />;
}

export const page = {
  svg: 25,
  children: <Commands />,
};
