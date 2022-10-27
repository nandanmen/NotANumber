import { FullWidth } from "~/components/FullWidth";
import { MotionSandbox } from "../MotionSandbox";

const motionCode = `import React from 'react'

export default function Motion() {
  const squareRef = React.useRef();
  const initialPositionRef = React.useRef();

  React.useEffect(() => {
    const box = squareRef.current?.getBoundingClientRect();
    if (moved(initialPositionRef.current, box)) {
      // get the difference in position
      const deltaX = initialPositionRef.current.x - box.x;
      const deltaY = initialPositionRef.current.y - box.y;
      console.log(deltaX, deltaY);

      // apply the transform to the box
      squareRef.current.style.transform = \`translate(\${deltaX}px, \${deltaY}px)\`;
    }
    initialPositionRef.current = box;
  });
  
  return <div id="motion" ref={squareRef} />;
}

const moved = (initialBox, finalBox) => {
  // we just mounted, so we don't have complete data yet
  if (!initialBox || !finalBox) return false;

  const xMoved = initialBox.x !== finalBox.x;
  const yMoved = initialBox.y !== finalBox.y;

  return xMoved || yMoved;
}
`;

export const InverseSandbox = () => {
  return (
    <FullWidth>
      <MotionSandbox motionCode={motionCode} />
    </FullWidth>
  );
};
