import type { ValueTransition } from "motion";

export const TRANSITIONS: Record<string, ValueTransition> = {
  swift: {
    type: "spring",
    stiffness: 280,
    damping: 18,
    mass: 0.3,
  },
  slow: {
    type: "spring",
    stiffness: 26.7,
    damping: 4.1,
    mass: 0.2,
  },
};
