import React from "react";

import { FullWidth } from "~/components/FullWidth";
import { Visualizer, Content, Controls } from "~/components/Visualizer";
import { styled } from "~/stitches.config";

import { Motion } from "../Motion";

export const SizeDistanceExample = () => {
  const [toggled, setToggled] = React.useState(false);
  return (
    <FullWidth>
      <Visualizer>
        <Content>
          <Wrapper toggled={toggled}>
            <Motion size={toggled ? 200 : 120} corrected={false} />
          </Wrapper>
        </Content>
        <Controls>
          <button onClick={() => setToggled(!toggled)}>Toggle</button>
        </Controls>
      </Visualizer>
    </FullWidth>
  );
};

const Wrapper = styled("div", {
  padding: "$8",
  display: "flex",
  alignItems: "center",
  height: 300,

  variants: {
    toggled: {
      true: {
        justifyContent: "flex-end",
      },
    },
  },
});
