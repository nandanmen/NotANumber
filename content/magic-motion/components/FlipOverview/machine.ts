import { createMachine } from "xstate";

export const machine = createMachine({
  id: "flipLast",
  initial: "idle",
  context: {
    origin: null,
    box: null,
  },
  states: {
    idle: {
      on: {
        click: "toggled",
        toggle: "toggled",
      },
    },
    toggled: {
      entry: ["measureOrigin"],
      on: {
        hover: "hovering",
        click: "measured",
      },
    },
    hovering: {
      on: {
        hoverEnd: "toggled",
        click: "measured",
      },
    },
    measured: {
      type: "final",
      entry: ["measureBox"],
    },
  },
});
