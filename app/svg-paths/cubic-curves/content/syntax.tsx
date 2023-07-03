import { useStateContext } from "../state";
import { CubicPlayground } from "./cubic-playground";

function Syntax() {
  const { data, set } = useStateContext("syntax");
  return (
    <CubicPlayground
      curve={data.path.atAbsolute(1)}
      state={data.state}
      onChange={({ curve, ...changes }) => {
        set({
          path: data.path.setAbsolute(1, curve),
          ...changes,
        });
      }}
      tooltip
    />
  );
}

export const components = { Syntax };

export const page = {
  children: <Syntax />,
  svg: 20,
};
