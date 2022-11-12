import React from "react";

import { FullWidth } from "~/components/FullWidth";
import {
  Visualizer,
  Content,
  Controls,
  ToggleButton,
} from "~/components/Visualizer";
import { styled } from "~/stitches.config";

import { Motion } from "../Motion";

export const SizeDistanceExample = ({ text = null, corrected = false }) => {
  const [toggled, setToggled] = React.useState(false);
  return (
    <FullWidth>
      <Visualizer>
        <Content>
          <Wrapper toggled={toggled}>
            <Motion size={toggled ? 200 : 120} corrected={corrected}>
              {text}
            </Motion>
          </Wrapper>
        </Content>
        <Controls>
          <ToggleButton onClick={() => setToggled(!toggled)}>
            Toggle
          </ToggleButton>
        </Controls>
      </Visualizer>
    </FullWidth>
  );
};

export const NaiveScaleCorrection = () => {
  const [toggled, setToggled] = React.useState(false);
  return (
    <FullWidth>
      <Visualizer>
        <Content>
          <Wrapper center>
            <Motion
              css={
                toggled
                  ? { width: "100%", height: 200 }
                  : { width: 120, height: 120 }
              }
              scaleCorrection="naive"
            >
              Hello
            </Motion>
          </Wrapper>
        </Content>
        <Controls>
          <ToggleButton onClick={() => setToggled(!toggled)}>
            Toggle
          </ToggleButton>
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
    center: {
      true: {
        justifyContent: "center",
      },
    },
  },
});
