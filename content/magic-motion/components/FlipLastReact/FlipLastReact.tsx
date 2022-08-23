import { FullWidth } from "~/components/FullWidth";
import { Sandbox } from "~/components/Sandbox";

const code = `import React from 'react'
import Motion from './Motion'

export default function App() {
  const [toggled, toggle] = React.useReducer(state => !state, false)

  return (
    <div>
      <button onClick={toggle}>Toggle</button>
      <div style={{ display: 'flex', justifyContent: toggled ? 'flex-end' : 'flex-start' }}>
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

  return (
    <div ref={squareRef} style={{ width: 100, aspectRatio: 1, background: 'blue' }} />
  )
}
`;

export const FlipLastReact = () => {
  return (
    <FullWidth>
      <Sandbox
        showConsole
        files={{
          "/App.js": code,
          "/Motion.js": {
            code: motionCode,
            active: true,
          },
        }}
      />
    </FullWidth>
  );
};
