import { Sandbox } from "~/components/Sandbox";

const css = `
html {
  background: hsl(0, 0%, 13.6%);
  color: white;
}

body {
  margin: 0;
  padding: 16px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

#motion {
  border: 1px solid hsl(0, 0%, 31.2%);
  background: hsl(0, 0%, 8.5%);
  padding: 8px 16px;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  outline: none;
}

#main {
  margin-top: 32px;
  display: flex;
  justify-content: center;
}
`;

const motionCode = `import React from 'react'
import { motion } from 'framer-motion'

export function NextButton() {
  const [toggled, toggle] = React.useReducer((state) => !state, false);

  return (
    <motion.button layout id="motion" onClick={toggle}>
      <motion.span
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ delay: 0.2 }}
      >
        {toggled ? "Next" : "Show Answer"}
      </motion.span>
    </motion.button>
  )
}`;

const code = `import React from 'react'
import { NextButton } from './button'
import './styles.css'

export default function App() {
  const [toggled, toggle] = React.useReducer(state => !state, false)

  return (
    <div id="main">
      <NextButton />
    </div>
  )
}
`;

export const NextButtonSandbox = () => {
  return (
    <Sandbox
      dependencies={{
        "framer-motion": "^9.0.4",
      }}
      files={{
        "/App.js": code,
        "/button.js": {
          code: motionCode,
          active: true,
        },
        "/styles.css": {
          code: css,
          hidden: true,
        },
      }}
    />
  );
};
