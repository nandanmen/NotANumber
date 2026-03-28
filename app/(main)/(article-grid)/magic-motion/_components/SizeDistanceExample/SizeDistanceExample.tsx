"use client";

import React from "react";

import {
  Content,
  Controls,
  ToggleButton,
  Visualizer,
} from "~/components/Visualizer";
import { Wide } from "~/components/mdx/Wide";
import { cn } from "~/lib/cn";

import { Motion } from "../Motion";

export const SizeDistanceExample = ({ text = null, corrected = false }) => {
  const [toggled, setToggled] = React.useState(false);
  return (
    <Wide>
      <Visualizer>
        <Content>
          <div
            className={cn(
              "flex h-[300px] items-center p-8",
              toggled ? "justify-end" : "justify-start",
            )}
          >
            <Motion size={toggled ? 200 : 120} corrected={corrected}>
              {text}
            </Motion>
          </div>
        </Content>
        <Controls>
          <ToggleButton onClick={() => setToggled(!toggled)}>
            Toggle
          </ToggleButton>
        </Controls>
      </Visualizer>
    </Wide>
  );
};

export const NaiveScaleCorrection = () => {
  const [toggled, setToggled] = React.useState(false);
  return (
    <Wide>
      <Visualizer>
        <Content>
          <div className="flex h-[300px] items-center justify-center p-8">
            <Motion
              style={
                toggled
                  ? { width: "100%", height: 200 }
                  : { width: 120, height: 120 }
              }
              scaleCorrection="naive"
            >
              Hello
            </Motion>
          </div>
        </Content>
        <Controls>
          <ToggleButton onClick={() => setToggled(!toggled)}>
            Toggle
          </ToggleButton>
        </Controls>
      </Visualizer>
    </Wide>
  );
};
