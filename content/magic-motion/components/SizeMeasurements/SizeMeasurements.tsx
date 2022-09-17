import React from "react";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";
import { BsPlayFill, BsPauseFill } from "react-icons/bs";

import { GridBackground } from "~/components/Grid";
import { FullWidth } from "~/components/FullWidth";
import { ChangeIndicator } from "~/components/ChangeIndicator";
import { styled } from "~/stitches.config";
import { useStepPlayer } from "~/lib/algorithm";

import {
  Square,
  ContentWrapper,
  Controls,
  ToggleButton,
  AlignmentText,
} from "../shared";

export const SizeMeasurements = () => {
  const [toggled, toggle] = React.useReducer((state) => !state, false);
  const [step, player] = useStepPlayer(["first", "last"]);

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
          <DisplayOnlySquare
            layout
            transition={{ duration: 1 }}
            toggled={step === "last"}
          />
        </Content>
      </GridBackground>
    </FullWidth>
  );
};

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

const DisplayOnlySquare = styled(Square, {
  pointerEvents: "none",
  height: 120,

  variants: {
    toggled: {
      true: {
        width: "100%",
        aspectRatio: "auto",
      },
    },
  },
});
