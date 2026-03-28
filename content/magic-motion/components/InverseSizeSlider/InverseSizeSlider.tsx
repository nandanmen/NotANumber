import React from "react";
import { animate, useMotionValue } from "framer-motion";

import { FullWidth } from "~/components/FullWidth";
import {
  Visualizer,
  Content,
  Controls,
  PlayButton,
  UndoButton,
} from "~/components/Visualizer";
import { styled } from "~/stitches.config";

import { Ruler, RulerWrapper, RulerText } from "../shared/Ruler";
import { SizeDiagram } from "../shared/SizeDiagram";

export const InverseSizeSlider = () => {
  const scale = useMotionValue(1);
  const [width, setWidth] = React.useState(0);

  return (
    <FullWidth>
      <Visualizer>
        <Content
          className="flex h-[300px] items-center p-[calc(2rem-2px)]"
        >
          <RulerWrapper style={{ transform: "translateY(-90px)" }}>
            <RulerText>120px</RulerText>
            <Ruler />
          </RulerWrapper>
          <SizeDiagram scale={scale} padding={1} onWidthChange={setWidth} />
          <OriginalSquare />
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
    </FullWidth>
  );
};

const OriginalSquare = styled("div", {
  width: 121,
  height: 120,
  borderRight: "1px dashed $blue8",
  position: "absolute",
});
