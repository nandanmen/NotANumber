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
    onHoverStart: () => {
      if (state !== "idle") return;
      set({ state: "hovering", active: id });
    },
    onHoverEnd: () => {
      if (state !== "hovering") return;
      set({ state: "idle", active: null });
    },
    onPanStart: () => {
      set({ state: "panning", active: id });
    },
    onPanEnd: () => {
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
