import { createMachine } from "xstate";

export const STATE_ORDER = ["idle", "first", "last", "inverse", "play"];

export const machine = createMachine({
  id: "flipLast",
  initial: "idle",
  context: {
    firstBox: null,
    lastBox: null,
  },
  states: {
    idle: {
      on: {
        next: "first",
      },
    },
    first: {
      entry: ["measureFirst"],
      on: {
        next: "last",
      },
    },
    last: {
      entry: ["measureLast", "removeTransform"],
      on: {
        next: "inverse",
        prev: "first",
      },
    },
    inverse: {
      entry: ["invert"],
      on: {
        next: "play",
        prev: "last",
      },
    },
    play: {
      entry: ["play"],
      on: {
        prev: "inverse",
        next: "first",
      },
    },
  },
});
