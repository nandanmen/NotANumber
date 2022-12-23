import { Sandbox } from "~/components/Sandbox";

const css = `
html {
  background: #151515;
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.square {
  border: 1px solid hsl(0, 0%, 24.3%);
  background: hsl(0, 0%, 15.8%);
  width: 120px;
  aspect-ratio: 1;
  border-radius: 8px;
}

#wrapper {
  margin-top: 8px;
  display: flex;
  gap: 8px;
}
`;

const styles = `.active {
  border: 1px solid hsl(208, 100%, 47.3%);
  background: hsl(206, 100%, 50%);
  width: 120px;
  height: 120px;
  border-radius: 8px;
  transition: width 0.5s ease-out;
}

.toggled {
  width: 200px;
}
`;

const code = `import React from 'react'
import Motion from './Motion'
import './main.css'

`;

const defaultAppCode = `export default function App() {
  const [toggled, toggle] = React.useReducer(state => !state, false)

  return (
    <div id="main">
      <button onClick={toggle}>Toggle</button>
      <div id="wrapper">
        <Motion toggled={toggled} />
        <div className="square" />
        <div className="square" />
      </div>
    </div>
  )
}
`;

const motionCode = `import React from 'react'
import './styles.css'

export default function Motion({ toggled }) {
  return <div className={\`active \${toggled ? 'toggled' : ''}\`} />
}`;

export const WidthTransitionSandbox = () => {
  return (
    <Sandbox
      files={{
        "/App.js": {
          code: code + defaultAppCode,
          hidden: true,
        },
        "/Motion.js": motionCode,
        "/styles.css": {
          code: styles,
          active: true,
        },
        "/main.css": {
          code: css,
          hidden: true,
        },
      }}
    />
  );
};
