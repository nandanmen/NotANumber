import React from "react";

import { Visualizer, Content, ToggleButton } from "~/components/Visualizer";
import { FullWidth } from "~/components/FullWidth";
import { ChangeIndicator } from "~/components/ChangeIndicator";
import { styled } from "~/stitches.config";

import { Square, Controls, AlignmentText } from "../shared";

export const FlipExample = () => {
  const [toggled, toggle] = React.useReducer((state) => !state, false);

  return (
    <FullWidth>
      <Controls>
        <ToggleButton onClick={toggle} whileTap={{ scale: 0.95 }}>
          Toggle Layout
        </ToggleButton>
        <AlignmentText>
          justify-content:{" "}
          <ChangeIndicator value={toggled}>
            {toggled ? "flex-end" : "flex-start"}
          </ChangeIndicator>
        </AlignmentText>
      </Controls>
      <Visualizer>
        <Content
          css={{
            display: "flex",
            justifyContent: toggled ? "flex-end" : "flex-start",
          }}
          padding="lg"
        >
          <DisplayOnlySquare layout transition={{ duration: 1 }} />
        </Content>
      </Visualizer>
    </FullWidth>
  );
};

const DisplayOnlySquare = styled(Square, {
  pointerEvents: "none",
});
