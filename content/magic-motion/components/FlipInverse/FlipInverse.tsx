import React from "react";
import { useMachine } from "@xstate/react";
import { assign } from "xstate";

import { GridBackground } from "~/components/Grid";
import { FullWidth } from "~/components/FullWidth";

import { Tooltip, ContentWrapper, XLine, YLine } from "../shared";
import { machine } from "./machine";
import { styled } from "~/stitches.config";

export const FlipInverse = () => {
  const buttonRef = React.useRef<HTMLButtonElement>();
  const [state, send] = useMachine(machine, {
    actions: {
      measureBox: assign({
        box: () => {
          return buttonRef.current?.getBoundingClientRect();
        },
      }),
    },
  });

  const active = state.matches("measured");
  const showRulers = ["hovering", "measured"].some(state.matches);

  return (
    <FullWidth>
      <GridBackground>
        <ContentWrapper>
          <svg width="100%" height="100%">
            <Initial x="1" />
            <Last x="100%" />
          </svg>
        </ContentWrapper>
      </GridBackground>
    </FullWidth>
  );
};

const Square = styled("rect", {
  width: 120,
  height: 120,
  fill: "$gray5",
  stroke: "$gray8",
  rx: 6,
  y: "50%",
});

const Initial = styled(Square, {
  transform: "translateY(-60px)",
});

const Last = styled(Square, {
  transform: "translate(-121px, -60px)",
});
