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

export const SizeLayoutExample = () => {
  const [toggled, toggle] = React.useReducer((state) => !state, false);

  return (
    <FullWidth>
      <Controls>
        <ToggleButton onClick={toggle} whileTap={{ scale: 0.95 }}>
          Toggle Layout
        </ToggleButton>
        <AlignmentText>
          width:{" "}
          <ChangeIndicator value={toggled}>
            {toggled ? "100%" : "120px"}
          </ChangeIndicator>
        </AlignmentText>
      </Controls>
      <GridBackground>
        <ContentWrapper>
          <DisplayOnlySquare
            layout
            transition={{ duration: 1 }}
            toggled={toggled}
          />
        </ContentWrapper>
      </GridBackground>
    </FullWidth>
  );
};

const DisplayOnlySquare = styled(Square, {
  pointerEvents: "none",
  height: 120,

  variants: {
    toggled: {
      true: {
        width: "100%",
        aspectRatio: "auto",
      },
    },
  },
});
