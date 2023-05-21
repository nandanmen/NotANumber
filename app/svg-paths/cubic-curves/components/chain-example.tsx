import { CommandHighlight } from "app/svg-paths/components/command-highlight";
import { DragGroupState } from "app/svg-paths/components/drag-group";
import { useStateContext } from "app/svg-paths/components/state-context";
import { Highlight } from "./syntax-example";

export function ChainExample() {
  const {
    data: { points, active },
  } = useStateContext<DragGroupState>("chainDrag");
  const [c0, c1, s1, s2] = points;
  return (
    <CommandHighlight
      id="chain"
      commands={[
        "M 10 10",
        {
          code: "C",
          template: (
            <span className="flex gap-[1ch]">
              <span>C</span>
              <Highlight value={c0[0]} active={active === 0} />
              <Highlight value={c0[1]} active={active === 0} />
              <Highlight value={c1[0]} active={active === 1} />
              <Highlight value={c1[1]} active={active === 1} />
              <span>4 5</span>
            </span>
          ),
        },
        {
          code: "S",
          template: (
            <span className="flex gap-[1ch]">
              <span>S</span>
              <Highlight value={s1[0]} active={active === 2} />
              <Highlight value={s1[1]} active={active === 2} />
              <span>11 5</span>
            </span>
          ),
        },
        {
          code: "S",
          template: (
            <span className="flex gap-[1ch]">
              <span>S</span>
              <Highlight value={s2[0]} active={active === 3} />
              <Highlight value={s2[1]} active={active === 3} />
              <span>9 10</span>
            </span>
          ),
        },
        "h -3",
        "m 0.25 0",
        "v 1.5",
        "h -0.25",
        "v 1",
        "q 0 1 1 1",
        "h 1",
        "q 1 0 1 -1",
        "v -1",
        "h -3",
        "m 2.75 0",
        "v -1.5",
      ]}
      indices={[1, 2, 3]}
      collapseAfter={5}
    />
  );
}
