import React from "react";
import { FaUndo, FaPlay } from "react-icons/fa";
import { animate, useMotionValue } from "framer-motion";

import { FullWidth } from "~/components/FullWidth";
import { Visualizer, Content, Controls } from "~/components/Visualizer";
import { styled } from "~/stitches.config";

import { IconButton } from "../shared";
import { Ruler, RulerWrapper, RulerText } from "../shared/Ruler";
import { SizeDiagram } from "../shared/SizeDiagram";

export const InverseSizeSlider = () => {
  const scale = useMotionValue(1);
  const [width, setWidth] = React.useState(0);

  return (
    <FullWidth>
      <Visualizer>
        <Content
          css={{
            height: 300,
            display: "flex",
            alignItems: "center",
            padding: `calc($space$8 - 2px)`,
          }}
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
          <IconButton
            secondary
            onClick={() => animate(scale, 120 / width, { duration: 3 })}
          >
            <FaPlay />
          </IconButton>
          <IconButton secondary onClick={() => scale.set(1)}>
            <FaUndo />
          </IconButton>
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
