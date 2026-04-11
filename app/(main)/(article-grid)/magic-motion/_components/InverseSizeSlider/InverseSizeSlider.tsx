"use client";

import { animate, useMotionValue } from "framer-motion";
import React from "react";

import {
  Content,
  Controls,
  PlayButton,
  UndoButton,
  Visualizer,
} from "~/components/Visualizer";
import { Wide } from "~/components/mdx/Wide";

import { Ruler, RulerText, RulerWrapper } from "../shared/Ruler";
import { SizeDiagram } from "../shared/SizeDiagram";

export const InverseSizeSlider = () => {
  const scale = useMotionValue(1);
  const [width, setWidth] = React.useState(0);

  return (
    <Wide>
      <Visualizer>
        <Content className="relative flex h-[300px] items-center p-[calc(2rem-2px)]">
          <RulerWrapper style={{ transform: "translateY(-90px)" }}>
            <RulerText>120px</RulerText>
            <Ruler />
          </RulerWrapper>
          <SizeDiagram scale={scale} padding={1} onWidthChange={setWidth} />
          <div className="absolute h-[120px] w-[121px] border-r border-dashed border-blue8" />
          <RulerWrapper full style={{ transform: "translateY(90px)" }}>
            <Ruler />
            <RulerText>{width}px</RulerText>
          </RulerWrapper>
        </Content>
        <Controls>
          <PlayButton
            onClick={() => animate(scale, 120 / width, { duration: 3 })}
          />
          <UndoButton onClick={() => scale.set(1)} />
        </Controls>
      </Visualizer>
    </Wide>
  );
};
