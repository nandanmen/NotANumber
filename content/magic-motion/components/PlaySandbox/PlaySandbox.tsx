import { FullWidth } from "~/components/FullWidth";
import { MotionSandbox } from "../MotionSandbox";

const motionCode = `import React from 'react'
import { animate } from 'popmotion'

export default function Motion() {
  const squareRef = React.useRef();
  const initialPositionRef = React.useRef();

  React.useEffect(() => {
    const box = squareRef.current?.getBoundingClientRect();
    if (moved(initialPositionRef.current, box)) {
      // get the difference in position
      const deltaX = initialPositionRef.current.x - box.x;
      const deltaY = initialPositionRef.current.y - box.y;

      // inverse the change using a transform
      squareRef.current.style.transform = \`translate(\${deltaX}px, \${deltaY}px)\`;

      // animate back to the final position
      animate({
        from: 1,
        to: 0,
        duration: 2000,
        onUpdate: progress => {
          squareRef.current.style.transform = 
            \`translate(\${deltaX * progress}px, \${deltaY * progress}px)\`;
        }
      })
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

export const PlaySandbox = () => {
  return (
    <FullWidth>
      <MotionSandbox motionCode={motionCode} />
    </FullWidth>
  );
};
