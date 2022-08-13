import { motion } from "framer-motion";
import React from "react";

import { GridBackground } from "~/components/Grid";
import { styled } from "~/stitches.config";

import { Button } from "../Button";

const useSequence = (phases: string[]) => {
  const [phase, setPhase] = React.useState(0);

  const next = () => {
    setPhase(Math.min(phase + 1, phases.length - 1));
  };
  const goTo = (phase: string) => {
    setPhase(phases.indexOf(phase));
  };

  return [phases[phase], { next, goTo }] as const;
};

const mapPhasesToProps = {
  Square: {
    blur: false,
    mask: false,
    playing: false,
  },
  Animate: {
    blur: false,
    mask: false,
  },
  Blur: {
    mask: false,
  },
  Mask: {},
};

const mapPhasesToCaption = {
  Square: "Create a square in the top right of the button.",
  Animate: "Animate the square around the edges of the button.",
  Blur: "Add a small blur to the square.",
  Mask: "Hide the parts of the square that's outside the border.",
};

const phases = ["Square", "Animate", "Blur", "Mask"];

export const ButtonSequence = () => {
  const [activePhase, { goTo, next }] = useSequence(phases);
  const props = mapPhasesToProps[activePhase];

  return (
    <div>
      <PhaseList>
        {phases.map((phase) => (
          <Phase key={phase}>
            <PhaseButton
              onClick={() => goTo(phase)}
              active={phase === activePhase}
            >
              {phase === activePhase && (
                <Svg>
                  <Rect
                    fill="none"
                    rx="3"
                    ry="3"
                    x="1"
                    y="1"
                    animate={{ pathLength: 1 }}
                    initial={{ pathLength: 0 }}
                    transition={{ type: "tween", ease: "linear", duration: 3 }}
                    onAnimationComplete={next}
                  />
                </Svg>
              )}
              {phase}
            </PhaseButton>
          </Phase>
        ))}
      </PhaseList>
      <GridBackground>
        <ContentWrapper>
          <Button {...props} />
        </ContentWrapper>
      </GridBackground>
      <Caption>{mapPhasesToCaption[activePhase]}</Caption>
    </div>
  );
};

const Rect = styled(motion.rect, {
  stroke: "currentColor",
  width: "calc(100% - 2px)",
  height: "calc(100% - 2px)",
});

const Svg = styled("svg", {
  position: "absolute",
  inset: -1,
  width: "calc(100% + 2px)",
  height: "calc(100% + 2px)",
});

const Caption = styled("p", {
  fontSize: "$sm",
  color: "$gray11",
  fontFamily: "$mono",
  marginTop: "$2",
});

const PhaseList = styled("ul", {
  display: "flex",
  listStyle: "none",
  justifyContent: "space-between",
  gap: "$8",
  marginBottom: "$4",
  position: "relative",

  "&:before": {
    content: "",
    position: "absolute",
    width: "100%",
    height: 2,
    background: "$gray7",
    top: "calc(50% - 1px)",
  },
});

const ContentWrapper = styled("div", {
  padding: "$8",
  display: "flex",
  justifyContent: "center",
});

const Phase = styled("li", {
  flex: 1,
  display: "flex",
  position: "relative",
});

const PhaseButton = styled("button", {
  padding: "$1 $2",
  background: "$gray5",
  display: "block",
  width: "100%",
  borderRadius: 4,
  textAlign: "center",
  color: "$gray8",
  border: "1px solid $gray7",
  fontSize: "$sm",
  cursor: "pointer",
  position: "relative",

  "&:hover": {
    background: "$gray6",
  },

  variants: {
    active: {
      true: {
        background: "$gray1",
        color: "$gray12",
        borderColor: "$gray8",

        "&:hover": {
          background: "$gray1",
        },
      },
    },
  },
});
