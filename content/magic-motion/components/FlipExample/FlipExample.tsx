import React from "react";

import { GridBackground } from "~/components/Grid";
import { FullWidth } from "~/components/FullWidth";
import { ChangeIndicator } from "~/components/ChangeIndicator";
import { styled } from "~/stitches.config";

import {
  Square,
  ContentWrapper,
  Controls,
  ToggleButton,
  AlignmentText,
} from "../shared";

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
      <GridBackground>
        <ContentWrapper toggled={toggled}>
          <DisplayOnlySquare layout transition={{ duration: 1 }} />
        </ContentWrapper>
      </GridBackground>
    </FullWidth>
  );
};

const DisplayOnlySquare = styled(Square, {
  pointerEvents: "none",
});
