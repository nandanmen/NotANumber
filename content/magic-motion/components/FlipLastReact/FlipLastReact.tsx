import { FullWidth } from "~/components/FullWidth";
import { Sandbox } from "~/components/Sandbox";

const css = `
body {
  margin: 0;
  padding: 0;
}

#motion {
  border: 1px solid hsl(208, 100%, 47.3%);
  background: hsl(208, 77.5%, 76.9%);
  width: 100px;
  aspect-ratio: 1;
  border-radius: 8px;
}

#wrapper {
  padding: 16px;
  background: hsl(0, 0%, 90.9%);
  border-radius: 12px;
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

const motionCode = `import React from 'react'

export default function Motion() {
  const squareRef = React.useRef()

  React.useEffect(() => {
    const box = squareRef.current?.getBoundingClientRect()
    if (box) { console.log(box.x, box.y) }
  })

  return <div id="motion" ref={squareRef} />
}
`;

export const FlipLastReact = () => {
  return (
    <FullWidth>
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
    </FullWidth>
  );
};
