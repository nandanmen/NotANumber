import React from "react";

import { GridBackground } from "~/components/Grid";
import { FullWidth } from "~/components/FullWidth";
import { ChangeIndicator } from "~/components/ChangeIndicator";

import {
  ContentWrapper,
  Controls,
  ToggleButton,
  AlignmentText,
} from "../shared";
import { SizeExample } from "../size";

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
          <SizeExample toggled={toggled} />
        </ContentWrapper>
      </GridBackground>
    </FullWidth>
  );
};
