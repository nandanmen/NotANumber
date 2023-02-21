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
  border: 1px solid hsl(208, 100%, 47.3%);
  background: hsl(206, 100%, 30%);
  width: 120px;
  aspect-ratio: 1;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

#wrapper {
  margin-top: 8px;
  display: flex;
}
`;

const motionCode = `import React from 'react'
import { motion } from 'framer-motion'

export function Motion() {
  React.useEffect(() => {
    console.log('<Motion /> mounted')
    return () => console.log('<Motion /> unmounted')
  }, [])

  return <motion.div animate={{ x: 200 }} id="motion" />
}`;

const code = `import React from 'react'
import { Motion } from './motion'
import { Refresh } from './refresh'
import './styles.css'

export default function App() {
  const [toggled, toggle] = React.useReducer(state => !state, false)

  return (
    <div id="main">
      <Refresh>
        <Motion />
      </Refresh>
    </div>
  )
}
`;

const refresh = `import React from 'react'

export const Refresh = ({ children }) => {
  const [key, setKey] = React.useState(0);
  return (
    <>
      <button onClick={() => setKey(key + 1)}>Refresh</button>
      <div key={key}>{children}</div>
    </>
  );
}
`;

export const RefreshComponent = () => {
  return (
    <Sandbox
      dependencies={{
        "framer-motion": "^9.0.4",
      }}
      files={{
        "/App.js": code,
        "/motion.js": motionCode,
        "/refresh.js": {
          code: refresh,
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
