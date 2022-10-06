import React from "react";
import { useMotionValue, animate, motion, useTransform } from "framer-motion";
import { FaUndo } from "react-icons/fa";

import { styled } from "~/stitches.config";
import { FullWidth } from "~/components/FullWidth";
import { GridBackground } from "~/components/Grid";
import { Slider } from "~/components/Slider";
import { SvgGridWrapper } from "~/components/SvgGridWrapper";

import { ToggleButton, Controls } from "../shared";
import { SvgSquare, SQUARE_RADIUS, BaseSvgSquare } from "../shared/styles";
import { Line, LineEndpoint } from "../shared/HorizontalRuler";
import { MotionSquare } from "../MotionSquare";

const CONTENT_HEIGHT = 300;
const MAX_HEIGHT_DELTA = 100;
const PADDING = 45;
const BASE_WIDTH = SQUARE_RADIUS * 2 + 50;
const TARGET_WIDTH = SQUARE_RADIUS * 2;

export const CorrectedInverseAnimation = () => {
  const [showScaleRulers, setShowScaleRulers] = React.useState(false);
  const [currentWidth, setCurrentWidth] = React.useState(BASE_WIDTH);
  const width = useMotionValue(BASE_WIDTH);

  const containerRef = React.useRef<HTMLDivElement>();
  const [containerWidth, setContainerWidth] = React.useState(0);

  React.useEffect(() => {
    setContainerWidth(containerRef.current?.getBoundingClientRect().width);
  }, []);

  const squareLeftSide = useTransform(
    width,
    (width) => containerWidth - width - PADDING
  );
  const xOffset = useTransform(
    width,
    (width) => PADDING + (currentWidth / 2 - width / 2)
  );
  const y = useTransform(width, (width) => CONTENT_HEIGHT / 2 - width / 2);

  return (
    <FullWidth>
      <WidthSlider
        defaultValue={[width.get()]}
        onValueChange={([newWidth]) => width.set(newWidth)}
        max={TARGET_WIDTH + MAX_HEIGHT_DELTA}
        min={TARGET_WIDTH - MAX_HEIGHT_DELTA}
        step={1}
      />
      <SvgGridWrapper noOverflow ref={containerRef}>
        <motion.g style={{ x: showScaleRulers ? xOffset : squareLeftSide, y }}>
          <MotionSquare width={width} showScaleRulers={showScaleRulers} />
        </motion.g>
      </SvgGridWrapper>
      <Controls>
        <ToggleButton
          onClick={() => {
            setCurrentWidth(width.get());
            animate(squareLeftSide, PADDING, {
              duration: 3,
              onComplete: () => {
                setShowScaleRulers(true);
                animate(width, TARGET_WIDTH, { duration: 2 });
              },
            });
          }}
        >
          Play
        </ToggleButton>
        <UndoButton
          onClick={() => {
            setShowScaleRulers(false);
            width.set(BASE_WIDTH);
          }}
        >
          <FaUndo />
        </UndoButton>
      </Controls>
    </FullWidth>
  );
};

const WidthSlider = styled(Slider, {
  marginBottom: "$6",
});

const UndoButton = styled(ToggleButton, {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "$gray10",
  height: 22,
});
