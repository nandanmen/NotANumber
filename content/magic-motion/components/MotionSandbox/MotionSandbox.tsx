import { Sandbox } from "~/components/Sandbox";

const css = `
body {
  margin: 0;
  padding: 0;
}

#motion {
  border: 1px solid hsl(208, 77.5%, 76.9%);
  background: hsl(209, 95%, 90.1%);
  width: 120px;
  aspect-ratio: 1;
  border-radius: 8px;
}

#wrapper {
  margin-top: 8px;
  display: flex;
}
`;

const code = `import React from 'react'
import Motion from './Motion'
import './styles.css'

export default function App() {
  const [toggled, toggle] = React.useReducer(state => !state, false)

  return (
    <div id="main">
      <button onClick={toggle}>Toggle</button>
      <div id="wrapper" style={{ justifyContent: toggled ? 'flex-end' : 'flex-start' }}>
        <Motion />
      </div>
    </div>
  )
}`;

export const MotionSandbox = ({ motionCode }) => {
  return (
    <Sandbox
      files={{
        "/App.js": code,
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
