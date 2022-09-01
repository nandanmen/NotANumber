import React from "react";
import { useMachine } from "@xstate/react";
import { assign } from "xstate";

import { GridBackground } from "~/components/Grid";
import { FullWidth } from "~/components/FullWidth";

import { Tooltip, ContentWrapper, Square, XLine, YLine } from "../shared";
import { machine } from "./machine";

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
            <rect x="0" y="0" width="120" height="120" fill="white" />
          </svg>
        </ContentWrapper>
      </GridBackground>
    </FullWidth>
  );
};
