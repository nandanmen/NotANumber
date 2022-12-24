import { Sandbox } from "~/components/Sandbox";

const css = `
html {
  background: #151515;
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

const code = `import React from 'react'
import Motion from './Motion'
import './styles.css'

`;

const defaultAppCode = `export default function App() {
  const [toggled, toggle] = React.useReducer(state => !state, false)

  return (
    <div id="main">
      <button onClick={toggle}>Toggle</button>
      <div id="wrapper" style={{ justifyContent: toggled ? 'flex-end' : 'flex-start' }}>
        <Motion />
      </div>
    </div>
  )
}
`;

export const MotionSandbox = ({ motionCode, appCode = defaultAppCode }) => {
  return (
    <Sandbox
      files={{
        "/App.js": code + appCode,
        "/Motion.js": {
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
