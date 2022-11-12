import React from "react";
import { animate, useMotionValue } from "framer-motion";
import { FaUndo, FaPlay } from "react-icons/fa";

import {
  Visualizer,
  Content,
  Controls,
  PlayButton,
  UndoButton,
} from "~/components/Visualizer";
import { FullWidth } from "~/components/FullWidth";

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
          <PlayButton onClick={() => animate(scale, 1, { duration: 3 })} />
          <UndoButton onClick={() => scale.set(120 / width)} />
        </Controls>
      </Visualizer>
    </FullWidth>
  );
};
