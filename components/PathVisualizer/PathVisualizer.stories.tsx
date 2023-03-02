import React from "react";
import { Visualizer, Content, Controls } from "~/components/Visualizer";
import { Counter } from "~/components/Counter";
import { PathVisualizer } from "./PathVisualizer";
import { parse } from "./utils";
import { phone } from "../paths/templates";

const commands = parse(phone);

export const Default = () => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [size, setSize] = React.useState(30);
  return (
    <Visualizer>
      <Content>
        <svg viewBox={`0 0 ${size} ${size}`}>
          <PathVisualizer activeIndex={activeIndex} commands={commands} />
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
