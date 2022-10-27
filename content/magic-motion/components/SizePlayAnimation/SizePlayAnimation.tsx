import React from "react";
import { animate, useMotionValue } from "framer-motion";
import { FaUndo, FaPlay } from "react-icons/fa";

import { Visualizer, Content, Controls } from "~/components/Visualizer";
import { FullWidth } from "~/components/FullWidth";

import { ToggleButton, IconButton } from "../shared";
import { SizeDiagram } from "../shared/SizeDiagram";

export const SizePlayAnimation = () => {
  const [width, setWidth] = React.useState(0);
  const scale = useMotionValue(1);
  return (
    <FullWidth>
      <Visualizer>
        <Content css={{ height: 300 }} noOverflow>
          <SizeDiagram
            scale={scale}
            onWidthChange={(width) => {
              setWidth(width);
              scale.set(120 / width);
            }}
          />
        </Content>
        <Controls>
          <IconButton
            onClick={() => animate(scale, 1, { duration: 3 })}
            secondary
          >
            <FaPlay />
          </IconButton>
          <IconButton onClick={() => scale.set(120 / width)} secondary>
            <FaUndo />
          </IconButton>
        </Controls>
      </Visualizer>
    </FullWidth>
  );
};
