import React from "react";
import { useMotionValue } from "framer-motion";

import { GridBackground } from "~/components/Grid";
import { FullWidth } from "~/components/FullWidth";
import { Slider } from "~/components/Slider";
import { styled } from "~/stitches.config";

import { ContentWrapper } from "../shared";
import { SizeDiagram } from "../shared/SizeDiagram";

export const InverseSizeSlider = () => {
  const scale = useMotionValue(1);
  const [width, setWidth] = React.useState(0);

  return (
    <FullWidth>
      <FigureWrapper>
        <Slider
          defaultValue={[1]}
          onValueChange={([newScale]) => scale.set(newScale)}
          max={1}
          min={120 / width}
          step={0.01}
        />
        <GridBackground>
          <Content>
            <SizeDiagram
              scale={scale}
              onWidthChange={(width) => setWidth(width)}
            />
          </Content>
        </GridBackground>
      </FigureWrapper>
    </FullWidth>
  );
};

const Content = styled(ContentWrapper, {
  height: 300,
  paddingLeft: `0 !important`,
  paddingRight: `0 !important`,
});

const FigureWrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$8",
});
