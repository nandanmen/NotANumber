import { MotionSandbox } from "../MotionSandbox";

const motionCode = `import React from 'react'

export default function Motion() {
  const squareRef = React.useRef();
  const initialPositionRef = React.useRef();

  React.useLayoutEffect(() => {
    const box = squareRef.current?.getBoundingClientRect();
    if (box) {
      // final position
      console.log(box.x, box.y)

      // initial position
      console.log(
        initialPositionRef.current?.x,
        initialPositionRef.current?.y
      );

      initialPositionRef.current = box;
    }
  });
  
  return <div id="motion" ref={squareRef} />;
}
`;

export const InitialPositionSandbox = () => {
  return <MotionSandbox motionCode={motionCode} />;
};
