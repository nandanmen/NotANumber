import { MotionSandbox } from "./MotionSandbox";

const motionCode = `import React from 'react'

export default function Motion() {
  const squareRef = React.useRef()

  React.useEffect(() => {
    const box = squareRef.current?.getBoundingClientRect()
    if (box) { console.log(box.x, box.y) }
  })

  return <div id="motion" ref={squareRef} />
}`;

export const Default = () => <MotionSandbox motionCode={motionCode} />;
