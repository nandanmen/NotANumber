import React from "react";
import { motion } from "framer-motion";
import {
  ExperimentsPage,
  ExperimentWrapper,
} from "~/components/layout/ExperimentsPage";

export default function TurboLogoPage() {
  const [isPack, toggle] = React.useReducer((state) => !state, true);
  return (
    <ExperimentsPage page="turbo-logo">
      <ExperimentWrapper
        css={{ border: "1px solid $gray8", borderRadius: "$base" }}
      >
        <svg viewBox="0 0 100 100">
          <defs>
            <linearGradient id="logo-gradient" gradientTransform="rotate(95)">
              <stop offset="0%" stopColor="#0096FF" />
              <stop offset="100%" stopColor="#FF1E56" />
            </linearGradient>
          </defs>
          <motion.g style={{ x: 50, y: 50 }}>
            <motion.rect
              width="55"
              height="55"
              x="-27.5"
              y="-27.5"
              fill="url('#logo-gradient')"
              animate={{ rx: isPack ? 8 : 27.5 }}
            />
            <motion.rect
              width="40"
              height="40"
              x="-20"
              y="-20"
              fill="var(--colors-gray4)"
              animate={{ rx: isPack ? 3 : 27.5 }}
            />
          </motion.g>
          <motion.g style={{ x: 25, y: 25 }}>
            <motion.rect
              width="50"
              height="50"
              x="-25"
              y="-25"
              fill="var(--colors-gray4)"
            />
          </motion.g>
          <line
            x1="50"
            y1="50"
            x2="0"
            y2="100"
            stroke="var(--colors-gray4)"
            strokeWidth="3"
          />
          <line
            x1="50"
            y1="50"
            x2="50"
            y2="100"
            stroke="var(--colors-gray4)"
            strokeWidth="3"
          />
          <motion.g style={{ x: 50, y: 50 }}>
            <motion.rect
              width="28"
              height="28"
              x="-14"
              y="-14"
              fill="none"
              stroke="black"
              strokeWidth="6"
              animate={{ rx: isPack ? 0 : 15 }}
            />
          </motion.g>
        </svg>
        <button onClick={toggle}>Toggle</button>
      </ExperimentWrapper>
    </ExperimentsPage>
  );
}
