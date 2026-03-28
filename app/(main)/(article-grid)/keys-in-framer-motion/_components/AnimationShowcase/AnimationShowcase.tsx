"use client";

import useInterval from "@use-it/interval";
import React from "react";
import { Content, Visualizer } from "~/components/Visualizer";
import { Wide } from "~/components/mdx/Wide";
import { KanjiViewer } from "../KanjiCarousel";
import { Button } from "../NextButton";

export const AnimationShowcase = ({ speed = 1500 }) => {
  const [toggled, toggle] = React.useReducer((state) => !state, false);
  const [currentIndex, next] = React.useReducer((index) => {
    return index === 2 ? 0 : index + 1;
  }, 0);

  useInterval(() => {
    next();
    toggle();
  }, speed);

  return (
    <Wide>
      <div className="grid grid-cols-2 gap-4 w-full overflow-x-auto px-[var(--content-padding)]">
        <Visualizer>
          <Content className="flex py-10 items-center justify-center h-full">
            <KanjiViewer showOverflow={false} index={currentIndex} />
          </Content>
        </Visualizer>
        <Visualizer>
          <Content className="flex py-10 items-center justify-center h-full">
            <Button toggled={toggled} />
          </Content>
        </Visualizer>
      </div>
    </Wide>
  );
};
