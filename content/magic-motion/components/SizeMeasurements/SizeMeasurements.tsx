import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import { FullWidth } from "~/components/FullWidth";
import { Visualizer, Content, Controls } from "~/components/Visualizer";
import { styled, keyframes } from "~/stitches.config";
import { useStepPlayer } from "~/lib/algorithm";

import { IconButton } from "../shared";
import { Ruler, RulerWrapper, RulerText } from "../shared/Ruler";
import { SizeExample } from "../size";

export const SizeMeasurements = () => {
  const boxRef = React.useRef<HTMLButtonElement>(null);

  const [step, player] = useStepPlayer(["first", "last"]);
  const [box, setBox] = React.useState(null);
  const [key, setKey] = React.useState(0);

  React.useEffect(() => {
    if (step === "last") {
      const box = boxRef.current?.getBoundingClientRect();
      setBox(box);
    }
  }, [step]);

  React.useEffect(() => {
    if (step === "first") {
      setKey((key) => key + 1);
    }
  }, [step]);

  return (
    <FullWidth>
      <Visualizer>
        <Content
          css={{ height: 300, display: "flex", alignItems: "center" }}
          padding="lg"
        >
          <RulerWrapper key={key} style={{ transform: "translateY(-90px)" }}>
            <RulerText>120px</RulerText>
            <Ruler />
          </RulerWrapper>
          <SizeExample toggled={step === "last"} ref={boxRef} layout={false} />
          {step === "last" && (
            <>
              <OriginalSquare />
              <RulerWrapper full style={{ transform: "translateY(90px)" }}>
                <Ruler />
                <RulerText>{box?.width}px</RulerText>
              </RulerWrapper>
            </>
          )}
        </Content>
        <Controls css={{ alignItems: "center" }}>
          <FlipStateList>
            <FlipState active={step === "first"}>First</FlipState>
            <FlipState active={step === "last"}>Last</FlipState>
          </FlipStateList>
          <StateControls>
            <IconButton
              onClick={player.prev}
              disabled={player.currentStep === 0}
              secondary
            >
              <FaArrowLeft />
            </IconButton>
            <IconButton
              onClick={player.next}
              disabled={player.currentStep === player.totalSteps - 1}
              secondary
            >
              <FaArrowRight />
            </IconButton>
          </StateControls>
        </Controls>
      </Visualizer>
    </FullWidth>
  );
};

const fadeIn = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
});

const OriginalSquare = styled("div", {
  background: `repeating-linear-gradient( -45deg, $colors$blue8, $colors$blue8 5px, transparent 5px, transparent 10px )`,
  width: 120,
  height: 120,
  borderRadius: "$base",
  border: "1px solid $blue8",
  position: "absolute",
  animationName: `${fadeIn}`,
  animationDuration: "500ms",
  animationFillMode: "forwards",
  animationTimingFunction: "ease-out",
});

const StateControls = styled("div", {
  display: "flex",
  gap: "$1",
});

const FlipStateList = styled("ol", {
  listStyle: "none",
  display: "flex",
  gap: "$1",
});

const FlipState = styled("li", {
  opacity: 0.2,
  transition: "opacity 0.3s ease-out",

  variants: {
    active: {
      true: {
        opacity: 1,
      },
    },
  },
});
