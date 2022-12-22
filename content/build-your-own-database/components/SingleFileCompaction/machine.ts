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
        pause: "paused",
        reset: "ready",
        done: "done",
      },
    },
    ready: {
      on: {
        play: "running",
      },
    },
    paused: {
      on: {
        play: "running",
      },
    },
    done: {
      on: {
        play: "running",
        reset: "ready",
      },
    },
  },
});
