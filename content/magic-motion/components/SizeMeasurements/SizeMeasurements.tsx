import React from "react";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";
import { BsPlayFill, BsPauseFill } from "react-icons/bs";
import { motion } from "framer-motion";

import { GridBackground } from "~/components/Grid";
import { FullWidth } from "~/components/FullWidth";
import { styled, keyframes } from "~/stitches.config";
import { useStepPlayer } from "~/lib/algorithm";

import { ContentWrapper, ToggleButton } from "../shared";
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
      console.log(box);
    }
  }, [step]);

  React.useEffect(() => {
    if (step === "first") {
      setKey((key) => key + 1);
    }
  }, [step]);

  return (
    <FullWidth>
      <Header>
        <StateControls>
          <StateButton onClick={player.toggle}>
            {player.isPlaying ? <BsPauseFill /> : <BsPlayFill />}
          </StateButton>
          <StateButton
            onClick={player.prev}
            disabled={player.currentStep === 0}
          >
            <HiArrowLeft />
          </StateButton>
          <StateButton
            onClick={player.next}
            disabled={player.currentStep === player.totalSteps - 1}
          >
            <HiArrowRight />
          </StateButton>
        </StateControls>
        <FlipStateList>
          <FlipState active={step === "first"}>First</FlipState>
          <FlipState active={step === "last"}>Last</FlipState>
        </FlipStateList>
      </Header>
      <GridBackground>
        <Content>
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
      </GridBackground>
    </FullWidth>
  );
};

const Ruler = () => {
  const [toggled, setToggled] = React.useState(false);

  React.useEffect(() => {
    const timeout = setTimeout(() => setToggled(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Measurement toggled={toggled}>
      <Bar layout transition={{ duration: 0.5 }} />
      <Bar layout transition={{ duration: 0.5 }} />
      <Line
        animate={{ scaleX: toggled ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        initial={{ scaleX: 0 }}
      />
    </Measurement>
  );
};

const RulerWrapper = styled("div", {
  width: 120,
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  position: "absolute",

  variants: {
    full: {
      true: {
        width: "calc(100% - $space$12 * 2)",
      },
    },
  },
});

const fadeIn = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
});

const OriginalSquare = styled("div", {
  background: `repeating-linear-gradient( -45deg, $colors$blue7, $colors$blue7 5px, transparent 5px, transparent 10px )`,
  width: 120,
  height: 120,
  borderRadius: "$base",
  border: "1px solid $blue7",
  position: "absolute",
  animationName: `${fadeIn}`,
  animationDuration: "500ms",
  animationFillMode: "forwards",
  animationTimingFunction: "ease-out",
});

const RulerText = styled(motion.p, {
  fontFamily: "$mono",
  color: "$gray11",
  fontSize: "$sm",
  opacity: 0,
  animationName: `${fadeIn}`,
  animationDuration: "500ms",
  animationFillMode: "forwards",
  animationTimingFunction: "ease-out",
});

const Line = styled(motion.div, {
  height: 2,
  width: "100%",
  background: "$gray8",
  position: "absolute",
  top: 4,
});

const Bar = styled(motion.div, {
  height: 10,
  width: 2,
  background: "$gray8",
});

const Measurement = styled("div", {
  display: "flex",
  justifyContent: "center",
  position: "relative",
  width: "100%",

  variants: {
    toggled: {
      true: {
        justifyContent: "space-between",
      },
    },
  },
});

const Content = styled(ContentWrapper, {
  height: 300,
});

const StateButton = styled(ToggleButton, {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "$gray10",
});

const StateControls = styled("div", {
  display: "flex",
  gap: "$1",
});

const Header = styled("header", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "$2",
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
