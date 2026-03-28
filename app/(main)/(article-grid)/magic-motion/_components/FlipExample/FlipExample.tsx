"use client";

import React from "react";

import { ChangeIndicator } from "~/components/ChangeIndicator";
import { Content, ToggleButton, Visualizer } from "~/components/Visualizer";
import { Wide } from "~/components/mdx/Wide";
import { cn } from "~/lib/cn";

import { AlignmentText, Controls, Square } from "../shared";

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
          className={cn("flex", toggled ? "justify-end" : "justify-start")}
          padding="lg"
        >
          <Square
            layout
            transition={{ duration: 1 }}
            className="pointer-events-none"
          />
        </Content>
      </Visualizer>
    </Wide>
  );
};
