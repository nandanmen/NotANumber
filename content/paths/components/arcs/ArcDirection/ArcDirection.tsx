import React from "react";
import { PathBackground } from "~/components/PathPlayground";
import { svgArcToCenterParam } from "~/components/PathVisualizer";
import { ArcPath, Ellipse } from "..";

const x0 = 10;
const y0 = 20;
const rx = 10;
const ry = 5;
const rotation = 0;
const x = 20;
const y = 20;

export const ArcDirection = () => {
  const [toggled, setToggled] = React.useState(false);
  const { cx, cy } = svgArcToCenterParam(x0, y0, rx, ry, rotation, 0, 0, x, y);
  return (
    <PathBackground size={30} step={5}>
      <Ellipse cx={cx} cy={cy} rx={rx} ry={ry} rotation={rotation} />
      <ArcPath
        key="toggled"
        x0={x0}
        y0={y0}
        rx={rx}
        ry={ry}
        rotation={rotation}
        largeArc={true}
        sweep={true}
        x={x}
        y={y}
        pathProps={{
          animate: { pathLength: 1 },
          initial: { pathLength: 0 },
          transition: { duration: 1.5, delay: 2.25 },
        }}
      />
      <ArcPath
        key="initial"
        x0={x0}
        y0={y0}
        rx={rx}
        ry={ry}
        rotation={rotation}
        largeArc={false}
        sweep={false}
        x={x}
        y={y}
        pathProps={{
          variants: {
            visible: {
              pathLength: 1,
              opacity: 1,
              transition: { duration: 1.5 },
            },
            hidden: { opacity: 0, pathLength: 1, transition: { delay: 0.5 } },
            start: { pathLength: 0 },
          },
          animate: toggled ? "hidden" : "visible",
          initial: "start",
          onAnimationComplete: () => setToggled(true),
        }}
      />
    </PathBackground>
  );
};
