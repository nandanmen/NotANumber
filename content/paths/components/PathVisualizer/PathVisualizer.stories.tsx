import React from "react";
import { Visualizer, Content, Controls } from "~/components/Visualizer";
import { Counter } from "~/components/Counter";
import { PathVisualizer } from "./PathVisualizer";
import { parse } from "./utils";

const heart = `M11.995 7.23319
C10.5455 5.60999 8.12832 5.17335 6.31215 6.65972
C4.4959 8.14609 4.2403 10.6312 5.66654 12.3892
L11.995 18.25
L18.3235 12.3892
C19.7498 10.6312 19.5253 8.13046 17.6779 6.65972
C15.8305 5.18899 13.4446 5.60999 11.995 7.23319
Z`;

const commands = parse(heart);

export const Default = () => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [size, setSize] = React.useState(30);
  return (
    <Visualizer>
      <Content>
        <svg viewBox={`0 0 ${size} ${size}`}>
          <PathVisualizer
            size={size}
            activeIndex={activeIndex}
            commands={commands}
          />
        </svg>
      </Content>
      <Controls css={{ justifyContent: "space-between" }}>
        <Counter
          value={activeIndex}
          onChange={setActiveIndex}
          min={0}
          max={commands.length - 1}
        >
          {activeIndex}
        </Counter>
        <Counter value={size} onChange={setSize} min={10} max={120} step={10}>
          {size}
        </Counter>
      </Controls>
    </Visualizer>
  );
};
