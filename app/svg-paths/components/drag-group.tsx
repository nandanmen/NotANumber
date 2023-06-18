import produce from "immer";
import { DraggableEndpoint } from "./draggable-endpoint";
import { useStateContext } from "./state-context";

export type PointsGroup = Array<[number, number]>;

export type DragGroupState = {
  state: "idle" | "hovering" | "panning";
  active: number | null;
  points: PointsGroup;
};

export function createInitialState(points: PointsGroup): DragGroupState {
  return {
    state: "idle",
    active: null,
    points,
  };
}

export function getDragPoints({
  points,
  state,
  set,
}: {
  points: PointsGroup;
  state?: DragGroupState["state"];
  set: (state: Partial<DragGroupState>) => void;
}) {
  const getHandlers = (index: number) => {
    if (!state) return {};
    return {
      hoverStart: () => {
        if (state !== "idle") return;
        set({ state: "hovering", active: index });
      },
      hoverEnd: () => {
        if (state !== "hovering") return;
        set({ state: "idle", active: null });
      },
      panStart: () => {
        set({ state: "panning", active: index });
      },
      panEnd: () => {
        set({ state: "idle", active: null });
      },
    };
  };
  return points.map(([x, y], index) => {
    return {
      x,
      y,
      on: {
        ...getHandlers(index),
        pan: (x: number, y: number) => {
          set({
            points: produce(points, (draft) => {
              draft[index] = [x, y];
            }),
          });
        },
      },
    };
  });
}

export function DragGroup({ source }: { source: string }) {
  const { data, set } =
    useStateContext<Record<string, DragGroupState>>()(source);
  const props = getDragPoints({
    points: data.points,
    state: data.state,
    set,
  });
  return (
    <>
      {props.map(({ x, y, on }, index) => {
        return <DraggableEndpoint key={index} cx={x} cy={y} />;
      })}
    </>
  );
}
