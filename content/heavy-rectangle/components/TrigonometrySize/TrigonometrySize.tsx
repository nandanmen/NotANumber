import React from "react";
import { FullWidth } from "~/components/FullWidth";
import { Slider } from "~/components/Slider";
import { Visualizer, Content, Controls } from "~/components/Visualizer";
import { styled } from "~/stitches.config";
import { Triangle } from "../TrigonometryFunctions";

export const TrigonometrySize = () => {
  const [size, setSize] = React.useState(100);
  return (
    <FullWidth>
      <Wrapper>
        <Visualizer>
          <Content>
            <svg viewBox="0 0 253 160">
              <Triangle
                angle={60}
                type="sin"
                config={{ size, x: 40 }}
                initial={false}
              />
            </svg>
          </Content>
          <Controls css={{ padding: "$4 $2" }}>
            <Slider
              min={100}
              max={200}
              value={[size]}
              onValueChange={([s]) => setSize(s)}
            />
          </Controls>
        </Visualizer>
      </Wrapper>
    </FullWidth>
  );
};

const Wrapper = styled("div", {
  display: "grid",
  gridTemplateColumns: "3fr 2fr",
});
