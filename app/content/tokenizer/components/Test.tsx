import snapshot from "../../../lib/snapshot.macro";
import { Algorithm } from "./Algorithm";

const count = snapshot(function count(input) {
  input++;
  debugger;
});

export const Test = () => {
  return (
    <Algorithm algorithm={count} initialInputs={[0]}>
      {(context) => <p>{context.state}</p>}
    </Algorithm>
  );
};
