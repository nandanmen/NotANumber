import { clsx } from "clsx";
import { useStateContext } from "../../components/state-context";
import type { SyntaxState } from "../types";

export const SyntaxExample = () => {
  const {
    data: { x1, y1, x, y, x2, y2, active },
  } = useStateContext<SyntaxState>("syntax");
  return (
    <p className="border border-gray8 bg-gray3 px-4 py-3 rounded-md font-mono relative overflow-hidden flex gap-[1ch]">
      <span className="text-gray10">M 5 13</span>
      <span>C</span>
      <Highlight value={x1} active={active === "x1"} />
      <Highlight value={y1} active={active === "x1"} />
      <Highlight value={x2} active={active === "x2"} />
      <Highlight value={y2} active={active === "x2"} />
      <Highlight value={x} active={active === "x"} />
      <Highlight value={y} active={active === "x"} />
    </p>
  );
};

const Highlight = ({
  value,
  active = false,
}: {
  value: number;
  active: boolean;
}) => {
  return (
    <span
      className={clsx(
        "transition-all",
        active && "bg-gray7 -mx-1 px-1 rounded-[4px]"
      )}
    >
      {value.toFixed(1)}
    </span>
  );
};
