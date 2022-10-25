import React from "react";
import useInterval from "@use-it/interval";
import { motion, useAnimation } from "framer-motion";

import { FullWidth } from "~/components/FullWidth";
import { Visualizer, Content, Controls } from "~/components/Visualizer";
import { styled } from "~/stitches.config";

import { InverseScaleFormula } from "../InverseScaleFormula";

const points = [
  {
    scale: 1,
    inverse: 1,
  },
  {
    scale: 1.4000000000000004,
    inverse: 0.7142857142857141,
  },
  {
    scale: 1.8000000000000007,
    inverse: 0.5555555555555554,
  },
  {
    scale: 2.1999999999999966,
    inverse: 0.45454545454545525,
  },
  {
    scale: 2.599999999999988,
    inverse: 0.38461538461538636,
  },
  {
    scale: 3,
    inverse: 0.3333333333333333,
  },
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
    playing ? 10 : null
  );

  return (
    <FullWidth>
      <Visualizer>
        <Content padding="lg">
          <Wrapper>
            <GraphWrapper>
              <svg viewBox="-0.5 -3.5 4 4">
                <ScaleLine
                  x1="0"
                  x2="3"
                  y1="-1"
                  y2="-3"
                  animate={controls}
                  initial={{ pathLength: 0 }}
                />
                <InverseScalePath
                  d={path}
                  animate={controls}
                  initial={{ pathLength: 0 }}
                />
                {points.map((point, index) => {
                  return (
                    <React.Fragment key={index}>
                      <GraphPoint
                        cx={(index * 3) / 5}
                        cy={point.inverse * -1}
                        secondary
                      />
                      <GraphPoint cx={(index * 3) / 5} cy={point.scale * -1} />
                    </React.Fragment>
                  );
                })}
              </svg>
            </GraphWrapper>
            <InverseScaleVisualWrapper>
              <InverseScaleFormula scale={scale} corrected />
            </InverseScaleVisualWrapper>
          </Wrapper>
        </Content>
        <Controls>
          <button
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
          </button>
        </Controls>
      </Visualizer>
    </FullWidth>
  );
};

const ScaleLine = styled(motion.line, {
  stroke: "$blue8",
  strokeWidth: 0.05,
});

const InverseScalePath = styled(motion.path, {
  stroke: "$yellow8",
  strokeWidth: 0.05,
  fill: "none",
});

const GraphPoint = styled("circle", {
  r: "0.05",
  fill: "$blue8",

  variants: {
    secondary: {
      true: {
        fill: "$yellow8",
      },
    },
  },
});

const Wrapper = styled("div", {
  display: "grid",
  gridTemplateColumns: "1fr 3fr",
  gap: "$2",
});

const GraphWrapper = styled("div", {
  gridColumn: 1,
  background: "$gray4",
  border: "1px solid $gray8",
  borderRadius: 4,
  aspectRatio: 1,
});

const InverseScaleVisualWrapper = styled("div", {
  gridColumn: 2,
});
