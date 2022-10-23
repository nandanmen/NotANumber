import { FullWidth } from "~/components/FullWidth";
import { MotionSandbox } from "../MotionSandbox";

const motionCode = `import React from 'react'
import { animate } from 'popmotion'

export default function Motion({ toggled, corrected, children }) {
  const squareRef = React.useRef();
  const childRef = React.useRef();

  const initialPositionRef = React.useRef();

  React.useEffect(() => {
    const box = squareRef.current?.getBoundingClientRect();
    if (changed(initialPositionRef.current, box)) {
      const transform = invert(squareRef.current, box, initialPositionRef.current)

      animate({
        from: transform,
        to: { x: 0, y: 0, scaleX: 1, scaleY: 1 },
        duration: 1000,
        onUpdate: ({ x, y, scaleX, scaleY }) => {
          squareRef.current.style.transform = 
            \`translate(\${x}px, \${y}px) scaleX(\${scaleX}) scaleY(\${scaleY})\`;
          if (corrected) {
            childRef.current.style.transform = \`scaleX(\${1 / scaleX}) scaleY(\${1 / scaleY})\`;
          }
        }
      })
    }
    initialPositionRef.current = box;
  });
  
  return (
    <div 
      id="motion"
      ref={squareRef}
      style={{
        width: toggled && '100%',
        aspectRatio: 'initial',
        height: 120
      }}
    >
      <div ref={childRef}>{children}</div>
    </div>
  );
}

const changed = (initialBox, finalBox) => {
  // we just mounted, so we don't have complete data yet
  if (!initialBox || !finalBox) return false;

  // deep compare the two boxes
  return JSON.stringify(initialBox) !== JSON.stringify(finalBox);
}

const invert = (el, from, to) => {
  const { x: fromX, y: fromY, width: fromWidth, height: fromHeight } = from;
  const { x, y, width, height } = to;

  const transform = {
    x: x - fromX - (fromWidth - width) / 2,
    y: y - fromY - (fromHeight - height) / 2,
    scaleX: width / fromWidth,
    scaleY: height / fromHeight,
  };

  el.style.transform = \`translate(\${transform.x}px, \${transform.y}px) scaleX(\${transform.scaleX}) scaleY(\${transform.scaleY})\`;

  return transform;
}
`;

const appCode = `export default function App() {
  const [toggled, toggle] = React.useReducer(state => !state, false)
  const [corrected, toggleCorrected] = React.useReducer(state => !state, false)

  return (
    <div id="main">
      <div>
        <button onClick={toggle}>Toggle</button>
        <label>
          <input type="checkbox" checked={corrected} onChange={toggleCorrected} />
          Corrected
        </label>
      </div>
      <div id="wrapper" style={{ justifyContent: 'center' }}>
        <Motion toggled={toggled} corrected={corrected}>Hello!</Motion>
      </div>
    </div>
  )
}
`;

export const InverseScaleSandbox = () => {
  return (
    <FullWidth>
      <MotionSandbox motionCode={motionCode} appCode={appCode} />
    </FullWidth>
  );
};
