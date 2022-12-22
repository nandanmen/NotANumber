import { createMachine } from "xstate";

export const machine = createMachine({
  id: "singleFileCompaction",
  initial: "idle",
  states: {
    idle: {
      on: {
        hover: "peek",
        play: "running",
      },
    },
    peek: {
      on: {
        hoverEnd: "idle",
        play: "running",
      },
    },
    running: {
      on: {
        stop: "ready",
        reset: "idle",
      },
    },
    ready: {
      on: {
        play: "running",
        reset: "idle",
      },
    },
  },
});
