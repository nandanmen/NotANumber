"use client";

import useInterval from "@use-it/interval";
import { motion, useAnimation } from "framer-motion";
import React from "react";

import {
  Content,
  Controls,
  ToggleButton,
  Visualizer,
} from "~/components/Visualizer";
import { Wide } from "~/components/mdx/Wide";
import { InverseScaleFormula } from "../InverseScaleFormula";

const points = [
  { scale: 1, inverse: 1 },
  { scale: 1.4000000000000004, inverse: 0.7142857142857141 },
  { scale: 1.8000000000000007, inverse: 0.5555555555555554 },
  { scale: 2.1999999999999966, inverse: 0.45454545454545525 },
  { scale: 2.599999999999988, inverse: 0.38461538461538636 },
  { scale: 3, inverse: 0.3333333333333333 },
];

const path = points.reduce((commands, point, index) => {
  return `${commands} L ${(index * 3) / 5} ${point.inverse * -1}`;
}, "M 0 -1");

export const InverseScaleGraph = () => {
  const [scale, setScale] = React.useState(1);
  const [playing, setPlaying] = React.useState(false);
  const controls = useAnimation();

  useInterval(
    () => {
      if (scale < 3) {
        setScale((scale) => scale + 0.01);
      } else {
        setPlaying(false);
      }
    },
    playing ? 10 : null,
  );

  return (
    <Wide>
      <Visualizer>
        <Content padding="lg">
          <div className="grid gap-8 md:grid-cols-[1fr_3fr] md:gap-2">
            <div className="aspect-square rounded border border-gray8 bg-gray4 md:col-start-1">
              <svg
                viewBox="-0.5 -3.5 4 4"
                role="img"
                aria-label="Scale versus inverse scale graph"
              >
                <motion.line
                  x1="0"
                  x2="3"
                  y1="-1"
                  y2="-3"
                  animate={controls}
                  initial={{ pathLength: 0 }}
                  className="stroke-blue8 [stroke-width:0.05]"
                />
                <motion.path
                  d={path}
                  animate={controls}
                  initial={{ pathLength: 0 }}
                  fill="none"
                  className="stroke-yellow8 [stroke-width:0.05]"
                />
                {points.map((point, index) => {
                  return (
                    <React.Fragment key={`${point.scale}-${point.inverse}`}>
                      <circle
                        cx={(index * 3) / 5}
                        cy={point.inverse * -1}
                        r={0.05}
                        className="fill-yellow8"
                      />
                      <circle
                        cx={(index * 3) / 5}
                        cy={point.scale * -1}
                        r={0.05}
                        className="fill-blue8"
                      />
                    </React.Fragment>
                  );
                })}
              </svg>
            </div>
            <div className="md:col-start-2">
              <InverseScaleFormula scale={scale} corrected />
            </div>
          </div>
        </Content>
        <Controls>
          <ToggleButton
            onClick={async () => {
              await controls.start({
                pathLength: 0,
                transition: { duration: 0 },
              });
              setScale(1);
              setPlaying(true);
              controls.start({
                pathLength: 1,
                transition: { duration: 2, ease: "linear" },
              });
            }}
          >
            Play
          </ToggleButton>
        </Controls>
      </Visualizer>
    </Wide>
  );
};
