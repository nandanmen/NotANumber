"use client";

import React from "react";

import { ChangeIndicator } from "~/components/ChangeIndicator";
import { GridBackground } from "~/components/Grid";
import { ToggleButton } from "~/components/Visualizer";
import { Wide } from "~/components/mdx/Wide";

import { AlignmentText, ContentWrapper, Controls } from "../shared";
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
