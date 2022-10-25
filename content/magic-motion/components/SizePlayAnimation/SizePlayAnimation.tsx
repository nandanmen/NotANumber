import React from "react";
import { animate, useMotionValue } from "framer-motion";
import { FaUndo } from "react-icons/fa";

import { GridBackground } from "~/components/Grid";
import { FullWidth } from "~/components/FullWidth";
import { styled } from "~/stitches.config";

import { ContentWrapper, ToggleButton, Controls } from "../shared";
import { SizeDiagram } from "../shared/SizeDiagram";

export const SizePlayAnimation = () => {
  const [width, setWidth] = React.useState(0);
  const scale = useMotionValue(1);
  return (
    <FullWidth>
      <Controls>
        <ToggleButton onClick={() => animate(scale, 1, { duration: 3 })}>
          Play
        </ToggleButton>
        <UndoButton onClick={() => scale.set(120 / width)}>
          <FaUndo />
        </UndoButton>
      </Controls>
      <GridBackground>
        <Content>
          <SizeDiagram
            scale={scale}
            onWidthChange={(width) => {
              setWidth(width);
              scale.set(120 / width);
            }}
          />
        </Content>
      </GridBackground>
    </FullWidth>
  );
};

const UndoButton = styled(ToggleButton, {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "$gray10",
  height: 22,
});

const Content = styled(ContentWrapper, {
  height: 300,
  paddingLeft: `0 !important`,
  paddingRight: `0 !important`,
});
