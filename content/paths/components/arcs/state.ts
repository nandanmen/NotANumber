import { assign, createMachine } from "xstate";

export const arcsMachine = createMachine(
  {
    schema: {
      context: {} as { name: string | null },
      events: {} as {
        type: "hoverStart" | "hoverEnd" | "panStart" | "panEnd";
        name: string;
      },
    },
    id: "arcs",
    initial: "idle",
    context: {
      name: null,
    },
    states: {
      idle: {
        on: {
          hoverStart: "hovering",
          panStart: "panning",
        },
        entry: ["clearName"],
      },
      hovering: {
        on: {
          hoverEnd: "idle",
          panStart: "panning",
        },
        entry: ["setName"],
      },
      panning: {
        on: {
          panEnd: "idle",
        },
        entry: ["setName"],
      },
    },
  },
  {
    actions: {
      setName: assign({
        name: (_, event) => event.name,
      }),
      clearName: assign({
        name: () => null as string | null,
      }),
    },
  }
);
