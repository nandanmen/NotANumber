import React from "react";
import { DragGroupState } from "app/svg-paths/components/drag-group";
import { clsx } from "clsx";
import { useStateContext } from "../../components/state-context";

export const SyntaxExample = () => {
  const {
    data: { points, active },
  } = useStateContext<DragGroupState>("syntax");
  return (
    <p className="border border-gray8 bg-gray3 px-4 py-3 rounded-md font-mono relative overflow-hidden flex gap-[1ch]">
      <span className="text-gray10">M 5 13</span>
      <span>C</span>
      {points.map(([x, y], index) => {
        return (
          <React.Fragment key={index}>
            <Highlight value={x} active={active === index} />
            <Highlight value={y} active={active === index} />
          </React.Fragment>
        );
      })}
    </p>
  );
};

export const Highlight = ({
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
        active && "bg-gray12 text-gray1 -mx-1 px-1 rounded-[4px]"
      )}
    >
      {value.toFixed(1)}
    </span>
  );
};
