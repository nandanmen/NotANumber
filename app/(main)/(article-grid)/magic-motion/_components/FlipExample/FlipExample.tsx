"use client";

import React from "react";

import { Visualizer, Content, ToggleButton } from "~/components/Visualizer";
import { Wide } from "~/components/mdx/Wide";
import { ChangeIndicator } from "~/components/ChangeIndicator";
import { cn } from "~/lib/cn";
import { styled } from "~/stitches.config";

import { Square, Controls, AlignmentText } from "../shared";

export const FlipExample = () => {
  const [toggled, toggle] = React.useReducer((state) => !state, false);

  return (
    <Wide>
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
          className={cn(
            "flex",
            toggled ? "justify-end" : "justify-start",
          )}
          padding="lg"
        >
          <DisplayOnlySquare layout transition={{ duration: 1 }} />
        </Content>
      </Visualizer>
    </Wide>
  );
};

const DisplayOnlySquare = styled(Square, {
  pointerEvents: "none",
});
