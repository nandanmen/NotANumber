import React from "react";
import { useMachine } from "@xstate/react";
import { assign } from "xstate";

import { GridBackground } from "~/components/Grid";
import { FullWidth } from "~/components/FullWidth";

import { Tooltip, ContentWrapper, Square, XLine, YLine } from "../shared";
import { machine } from "./machine";

export const FlipFirst = () => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
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
          {showRulers && (
            <>
              <XLine active={active} />
              <YLine active={active} align="left" />
            </>
          )}
          <Square
            ref={buttonRef}
            onClick={() => send("click")}
            onHoverStart={() => send("hover")}
            onHoverEnd={() => send("hoverEnd")}
            whileTap={{ scale: 0.95 }}
            active={active}
          >
            Click me!
          </Square>
          {active && (
            <Tooltip
              initial={{ x: -4, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              align="right"
            >
              <p>x: {state.context.box?.x.toFixed(1)}</p>
              <p>y: {state.context.box?.y.toFixed(1)}</p>
            </Tooltip>
          )}
        </ContentWrapper>
      </GridBackground>
    </FullWidth>
  );
};
