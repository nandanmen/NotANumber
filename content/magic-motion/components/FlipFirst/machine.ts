import { createMachine } from "xstate";

export const machine = createMachine({
  id: "flipLast",
  initial: "idle",
  context: {
    box: null,
  },
  states: {
    idle: {
      on: {
        click: "measured",
        hover: "hovering",
      },
    },
    hovering: {
      on: {
        hoverEnd: "idle",
        click: "measured",
      },
    },
    measured: {
      type: "final",
      entry: ["measureBox"],
    },
  },
});
