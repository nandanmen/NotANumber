import { FullWidth } from "~/components/FullWidth";
import { MotionSandbox } from "../MotionSandbox";

const motionCode = `import React from 'react'

export default function Motion() {
  const squareRef = React.useRef()

  React.useLayoutEffect(() => {
    const box = squareRef.current?.getBoundingClientRect()
    if (box) { console.log(box.x, box.y) }
  })

  return <div id="motion" ref={squareRef} />
}
`;

export const FlipLastReact = () => {
  return (
    <FullWidth>
      <MotionSandbox motionCode={motionCode} />
    </FullWidth>
  );
};
