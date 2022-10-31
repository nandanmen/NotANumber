import React from "react";
import { useMachine } from "@xstate/react";
import { assign } from "xstate";

import { GridBackground } from "~/components/Grid";
import { FullWidth } from "~/components/FullWidth";
import { ChangeIndicator } from "~/components/ChangeIndicator";

import {
  Tooltip,
  Square,
  PositionText,
  ContentWrapper,
  XLine,
  YLine,
  Controls,
  ToggleButton,
  AlignmentText,
} from "../shared";
import { machine } from "./machine";

export const FlipLast = () => {
  const originalRef = React.useRef<HTMLButtonElement>();
  const buttonRef = React.useRef<HTMLButtonElement>();

  const [state, send] = useMachine(machine, {
    actions: {
      measureOrigin: assign({
        origin: () => {
          return originalRef.current?.getBoundingClientRect();
        },
      }),
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
      <Controls>
        <ToggleButton
          onClick={() => send("toggle")}
          disabled={!state.matches("idle")}
          whileTap={{ scale: 0.95 }}
        >
          Toggle Layout
        </ToggleButton>
        <AlignmentText>
          justify-content:{" "}
          <ChangeIndicator value={state.matches("idle")}>
            {state.matches("idle") ? "flex-start" : "flex-end"}
          </ChangeIndicator>
        </AlignmentText>
      </Controls>
      <GridBackground>
        <ContentWrapper toggled={!state.matches("idle")}>
          {showRulers && (
            <>
              <XLine active={active} />
              <YLine active={active} align="right" />
            </>
          )}
          <Square
            ref={originalRef}
            outline
            css={{ left: "$8", "@md": { left: "$12" } }}
          >
            <PositionText>x: {state.context.origin?.x.toFixed(1)}</PositionText>
            <PositionText>y: {state.context.origin?.y.toFixed(1)}</PositionText>
          </Square>
          {active && (
            <Tooltip
              initial={{ x: -4, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              align="left"
            >
              <p>x: {state.context.box?.x.toFixed(1)}</p>
              <p>y: {state.context.box?.y.toFixed(1)}</p>
            </Tooltip>
          )}
          <Square
            ref={buttonRef}
            onClick={() => send("click")}
            onHoverStart={() => send("hover")}
            onHoverEnd={() => send("hoverEnd")}
            whileTap={{ scale: 0.95 }}
            active={active}
          >
            {state.matches("idle") ? "Toggle my position!" : "Click me!"}
          </Square>
        </ContentWrapper>
      </GridBackground>
    </FullWidth>
  );
};
