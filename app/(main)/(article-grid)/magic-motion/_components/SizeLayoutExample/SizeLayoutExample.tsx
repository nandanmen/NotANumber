"use client";

import React from "react";

import { GridBackground } from "~/components/Grid";
import { Wide } from "~/components/mdx/Wide";
import { ChangeIndicator } from "~/components/ChangeIndicator";
import { ToggleButton } from "~/components/Visualizer";

import { ContentWrapper, Controls, AlignmentText } from "../shared";
import { SizeExample } from "../size";

export const SizeLayoutExample = () => {
  const [toggled, toggle] = React.useReducer((state) => !state, false);

  return (
    <Wide>
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
    </Wide>
  );
};
