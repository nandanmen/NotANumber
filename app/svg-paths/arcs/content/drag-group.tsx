export type PointsGroup = Array<[number, number]>;

export type DragGroupState = {
  state: "idle" | "hovering" | "panning";
  active: string[];
};

export function getDragHandlers({
  id,
  state,
  set,
}: {
  id: string[];
  state: DragGroupState["state"];
  set: (state: DragGroupState) => void;
}) {
  return {
    hoverStart: () => {
      if (state !== "idle") return;
      set({ state: "hovering", active: id });
    },
    hoverEnd: () => {
      if (state !== "hovering") return;
      set({ state: "idle", active: null });
    },
    panStart: () => {
      set({ state: "panning", active: id });
    },
    panEnd: () => {
      set({ state: "idle", active: null });
    },
  };
}

export function createInitialState(): DragGroupState {
  return {
    state: "idle",
    active: null,
  };
}
